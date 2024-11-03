// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISushiBar {
    /**
     * @notice Stake Sushi tokens in exchange for xSushi tokens
     * @param _amount The amount of Sushi tokens to stake
     */
    function enter(uint256 _amount) external;

    /**
     * @notice Unstake xSushi tokens in exchange for Sushi tokens
     * @param _share The amount of xSushi tokens to unstake
     */
    function leave(uint256 _share) external;

    /**
     * @notice Get the balance of xSushi for a specified account
     * @param account The address to query
     * @return The balance of xSushi tokens held by the account
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @notice Get the Sushi balance (the Sushi tokens in the SushiBar contract)
     * @return The total Sushi balance held by the contract
     */
    function sushiBalance() external view returns (uint256);

    /**
     * @notice Get the xSushi balance (total supply of xSushi tokens)
     * @return The total xSushi tokens in circulation
     */
    function totalSupply() external view returns (uint256);
}