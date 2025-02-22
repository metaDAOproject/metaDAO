import { Autocrat as AutocratProgram } from "./autocrat.js";
import AutocratIDL from "../idl/autocrat.json";
export { AutocratProgram, AutocratIDL };

import { Amm as AmmProgram } from "./amm.js";
import AmmIDL from "../idl/amm.json";
export { AmmProgram, AmmIDL };

import { ConditionalVault as ConditionalVaultProgram } from "./conditional_vault.js";
import ConditionalVaultIDL from "../idl/conditional_vault.json";
export { ConditionalVaultProgram, ConditionalVaultIDL };

export { LowercaseKeys } from "./utils.js";

import type {
  IdlAccounts,
  IdlTypes,
  IdlEvents,
} from "@coral-xyz/anchor-0.30.1";

export type Question = IdlAccounts<ConditionalVaultProgram>["question"];
export type ConditionalVault =
  IdlAccounts<ConditionalVaultProgram>["conditionalVault"];

export type InitializeDaoParams =
  IdlTypes<AutocratProgram>["initializeDaoParams"];
export type UpdateDaoParams = IdlTypes<AutocratProgram>["updateDaoParams"];
export type ProposalInstruction =
  IdlTypes<AutocratProgram>["proposalInstruction"];

export type Dao = IdlAccounts<AutocratProgram>["dao"];
export type Proposal = IdlAccounts<AutocratProgram>["proposal"];
export type Amm = IdlAccounts<AmmProgram>["amm"];

export type SwapEvent = IdlEvents<AmmProgram>["swapEvent"];
export type AddLiquidityEvent = IdlEvents<AmmProgram>["addLiquidityEvent"];
export type RemoveLiquidityEvent =
  IdlEvents<AmmProgram>["removeLiquidityEvent"];
export type CreateAmmEvent = IdlEvents<AmmProgram>["createAmmEvent"];
export type CrankThatTwapEvent = IdlEvents<AmmProgram>["crankThatTwapEvent"];
export type AmmEvent =
  | SwapEvent
  | AddLiquidityEvent
  | RemoveLiquidityEvent
  | CreateAmmEvent
  | CrankThatTwapEvent;

export type AddMetadataToConditionalTokensEvent =
  IdlEvents<ConditionalVaultProgram>["addMetadataToConditionalTokensEvent"];
export type InitializeConditionalVaultEvent =
  IdlEvents<ConditionalVaultProgram>["initializeConditionalVaultEvent"];
export type InitializeQuestionEvent =
  IdlEvents<ConditionalVaultProgram>["initializeQuestionEvent"];
export type MergeTokensEvent =
  IdlEvents<ConditionalVaultProgram>["mergeTokensEvent"];
export type RedeemTokensEvent =
  IdlEvents<ConditionalVaultProgram>["redeemTokensEvent"];
export type ResolveQuestionEvent =
  IdlEvents<ConditionalVaultProgram>["resolveQuestionEvent"];
export type SplitTokensEvent =
  IdlEvents<ConditionalVaultProgram>["splitTokensEvent"];
export type ConditionalVaultEvent =
  | AddMetadataToConditionalTokensEvent
  | InitializeConditionalVaultEvent
  | InitializeQuestionEvent
  | MergeTokensEvent
  | RedeemTokensEvent
  | ResolveQuestionEvent
  | SplitTokensEvent;
