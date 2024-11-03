//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ISushiBar} from "./ISushiBar.sol";

contract TokenVault is ERC4626, ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public immutable xSushi;
    IERC20 public immutable sushi;
    IERC20 public immutable WETH;
    ISwapRouter public immutable swapRouter;
    IUniswapV3Factory public immutable factory;

    mapping(address => uint256) private shareHolder;
    
    constructor
    (
        address _asset,
        ISwapRouter _swapRouter,
        IERC20 _WETH,
        IERC20 _sushi,
        IUniswapV3Factory _factory,
        string memory _name,
        string memory _symbol
    ) ERC4626 (IERC20(_asset)) ERC20(_name, _symbol)
    {
        xSushi = _asset;
        sushi = _sushi;
        swapRouter = _swapRouter;
        WETH = _WETH;
        factory = _factory;
    }

    
    function zapIn(address tokenAddress, uint256 tokenAmount) external nonReentrant {
        require(tokenAddress != address(0), "Wrong token address");
        require(tokenAmount > 0, "Wrong token amount");

        TransferHelper.safeTransferFrom(tokenAddress, msg.sender, address(this), tokenAmount);

        if (tokenAddress != address(sushi)) {
            swapFromTokenToSushi(tokenAddress, tokenAmount);
        }
        uint256 sushiBalance = IERC20(sushi).balanceOf(address(this));
        TransferHelper.safeApprove(address(sushi), xSushi, sushiBalance);
        
        ISushiBar(xSushi).enter(sushiBalance);

        uint256 xSushiAmount = IERC20(xSushi).balanceOf(address(this));
        _mint(msg.sender, xSushiAmount);
    }

    function swapFromTokenToSushi(address tokenAddress, uint256 amount) private {
        TransferHelper.safeApprove(tokenAddress, address(swapRouter), amount);

        bytes memory path;
        if (checkLiquidity(tokenAddress, address(sushi))) {
            path = abi.encodePacked(tokenAddress, uint24(3000), address(sushi));
        } else {
            path = abi.encodePacked(tokenAddress, uint24(3000), WETH, uint24(3000), address(sushi));
        }

        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
            path: path,
            recipient: address(this),
            deadline: block.timestamp + 120,
            amountIn: amount,
            amountOutMinimum: 0
        });

        swapRouter.exactInput(params);
    }

    function zapOut(address tokenAddress) external nonReentrant {
        uint256 userBalance = balanceOf(msg.sender);
        require(userBalance > 0, "You don't have shares");

        uint256 xSushiAmount = previewRedeem(userBalance);
        _burn(msg.sender, xSushiAmount);

        uint256 xSushiBalance = IERC20(xSushi).balanceOf(address(this));
        ISushiBar(xSushi).leave(xSushiBalance);

        uint256 sushiBalance = IERC20(sushi).balanceOf(address(this));

        if (tokenAddress != address(sushi)) {
            swapFromSushiToToken(tokenAddress, sushiBalance, msg.sender);
        } else {
            TransferHelper.safeTransferFrom(address(sushi), address(this), msg.sender, sushiBalance);
        }

    }    
    
    function swapFromSushiToToken(address tokenAddress, uint256 amount, address receiver) private {
        TransferHelper.safeApprove(address(sushi), address(swapRouter), amount);

        bytes memory path;
        if (checkLiquidity(address(sushi), tokenAddress)) {
            path = abi.encodePacked(address(sushi), uint24(3000), tokenAddress);
        } else {
            path = abi.encodePacked(address(sushi), uint24(3000), WETH, uint24(3000), tokenAddress);
        }

        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
            path: path,
            recipient: receiver,
            deadline: block.timestamp + 120,
            amountIn: amount,
            amountOutMinimum: 0
        });

        swapRouter.exactInput(params);
    }

    function checkLiquidity(address tokenA, address tokenB) private view returns (bool) {
        address pool = factory.getPool(tokenA, tokenB, uint24(3000));
        return pool != address(0);
    }
}