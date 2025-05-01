// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Bets} from "../src/Bets.sol";

contract BetsScript is Script {
    function run() public {
        vm.startBroadcast();

        address admin = 0x67a8f5F7936DC353D8E0A5bEDDb54f6C9ecA77CC;

        new Bets(admin);

        vm.stopBroadcast();
    }
}
