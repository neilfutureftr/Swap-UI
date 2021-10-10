import * as assert from "assert";
import React, { useContext, useState, useEffect } from "react";
import { useAsync } from "react-async-hook";
import { PublicKey } from "@solana/web3.js";

import {
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Market } from "@project-serum/serum";
import { SRM_MINT, USDC_MINT, USDT_MINT, FTR_MINT,Q_FIXED_RATE,P_FIXED_RATE } from "../utils/pubkeys";
import {
  useFairRoute,
  useRouteVerbose,
  useDexContext,
  FEE_MULTIPLIER,
} from "./Dex";
import {
  useTokenListContext,
  SPL_REGISTRY_SOLLET_TAG,
  SPL_REGISTRY_WORM_TAG,
} from "./TokenList";
import { useOwnedTokenAccount } from "../context/Token";

const DEFAULT_SLIPPAGE_PERCENT = 0.5;

let textify="old";


export type SwapContext = {
  // Mint being traded from. The user must own these tokens.
  fromMint: PublicKey;
  toMint: PublicKey;
  ftrMint : PublicKey;

  setFromMint: (m: PublicKey) => void;
  setFromFtrMint: (m: PublicKey) => void;
  setToMint: (m: PublicKey) => void;
  setToFtrMint: (m: PublicKey) => void;

  // Amount used for the swap.
  fromAmount: number;
  fromFtrAmount: number;
  toFtrAmount: number;
  toAmount: number;

  setFromAmount: (a: number) => void;
  setFromFtrAmount: (a: number) => void;
  text_B: string;
  setText_B:(a: string)=> void;
  invisible1: boolean;
  setinvisible1: (a: boolean)=> void;
  invisible2: boolean;
  setinvisible2: (a: boolean)=> void;
  setToFtrAmount: (a: number) => void;
  setToAmount: (a: number) => void;

  // Function to flip what we consider to be the "to" and "from" mints.
  swapToFromMints: () => void;

  // The amount (in units of percent) a swap can be off from the estimate
  // shown to the user.
  slippage: number;
  setSlippage: (n: number) => void;

  // Null if the user is using fairs directly from DEX prices.
  // Otherwise, a user specified override for the price to use when calculating
  // swap amounts.
  fairOverride: number | null;
  fairPriceLoc:number;
  fairPriceLocFTR:number;
  setFairOverride: (n: number | null) => void;
  setfairPriceLoc:(n:number)=>void;
  setfairPriceLocFTR:(n:number)=>void;

  // The referral *owner* address. Associated token accounts must be created,
  // first, for this to be used.
  referral?: PublicKey;

  // True if all newly created market accounts should be closed in the
  // same user flow (ideally in the same transaction).
  isClosingNewAccounts: boolean;

  // True if the swap exchange rate should be a function of nothing but the
  // from and to tokens, ignoring any quote tokens that may have been
  // accumulated by performing the swap.
  //
  // Always false (for now).
  isStrict: boolean;
  setIsStrict: (isStrict: boolean) => void;

  setIsClosingNewAccounts: (b: boolean) => void;
};
const _SwapContext = React.createContext<null | SwapContext>(null);

export function SwapContextProvider(props: any) {
  const [fromMint, setFromMint] = useState(props.fromMint ?? Q_FIXED_RATE);
  const [ftrMint, setFromFtrMint] = useState(props.fromMint ?? FTR_MINT);
  const [ftrToMint, setToFtrMint] = useState(props.fromMint ?? FTR_MINT);
  const [toMint, setToMint] = useState(props.toMint ?? USDC_MINT);
  const [fromAmount, _setFromAmount] = useState(props.fromAmount ?? 0);

  const [fromFtrAmount, setFromFtrAmount] = useState(props.fromFtrAmount ?? 0);
  const [toFtrAmount, setToFtrAmount] = useState(props.toFtrAmount ?? 0);
  const [toAmount, _setToAmount] = useState(props.toAmount ?? 0);
  const [isClosingNewAccounts, setIsClosingNewAccounts] = useState(false);
  const [isStrict, setIsStrict] = useState(false);
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE_PERCENT);
  const [fairOverride, setFairOverride] = useState<number | null>(null);

  const [fairPriceLoc, setfairPriceLoc] = useState<number >(100);
  const [fairPriceLocFTR, setfairPriceLocFTR] = useState<number >(6);
  const [text_B, setText_B] = useState<string >("Buy");
  const [invisible1, setinvisible1] = useState<boolean >(false);
  const [invisible2, setinvisible2] = useState<boolean >(false);

  const fair = _useSwapFair(fromMint, toMint, fairOverride,fairPriceLoc,setfairPriceLoc);
  let fair_ftr =_useFtrFair(fairPriceLocFTR,setfairPriceLocFTR);

  const referral = props.referral;

  assert.ok(slippage >= 0);

  useEffect(() => {
    if (!fair) {
      return;
    }
    setFromAmount(fromAmount);
  }, [fair]);

  const swapToFromMints = () => {
    const oldFrom = fromMint;
    const oldTo = toMint;
    const oldToAmount = toAmount;
    _setFromAmount(oldToAmount);
    setFromMint(oldTo);
    setToMint(oldFrom);
  };

  const setFromAmount = (amount: number) => {
    console.log("Maaaais");
    console.log(fair);
    if (fair === undefined) {
      _setFromAmount(0);
      _setToAmount(0);

      return;
    }
    _setFromAmount(amount);

    _setToAmount(FEE_MULTIPLIER * (amount * fair));
    let fairloc=fair;
    if (fair!=undefined){
    if (fair<1){fairloc=1;setinvisible1(false);
        setinvisible2(true);}
    if (fair>=1){fairloc=fair;setinvisible1(true);
        setinvisible2(false);}}


    console.log("Labase");


    setToFtrAmount(FEE_MULTIPLIER * (amount * fairloc/10/fair_ftr));
    setFromFtrAmount(FEE_MULTIPLIER * (amount * fairloc/10/fair_ftr));
  };



  const setToAmount = (amount: number) => {

    console.log("Maaaais");
    console.log(fair);

    if (fair === undefined) {
      _setFromAmount(0);
      _setToAmount(0);
      return;
    }
    _setToAmount(amount);
    console.log("hehe");
    _setFromAmount((amount / fair) );
    let fairloc=fair;




    if (fair!=undefined){
    if (fair<1){fairloc=fair; setinvisible1(false);
        setinvisible2(true);}else {fairloc=1;    setinvisible1(true);
        setinvisible2(false);}}
    console.log("Nah forreal from");
    console.log(fair);
    setToFtrAmount(FEE_MULTIPLIER * (amount / fairloc/10/fair_ftr));
    setFromFtrAmount(FEE_MULTIPLIER * (amount / fairloc/10/fair_ftr));



  };

  return (
    <_SwapContext.Provider
      value={{
        ftrMint,
        fromMint,
        toMint,

        setFromMint,
        setFromFtrMint,
        setToMint,
        setToFtrMint,




        fromAmount,
        fromFtrAmount,
        toAmount,
        toFtrAmount,

        setFromAmount,
        setFromFtrAmount,
        setToAmount,
        setToFtrAmount,

        swapToFromMints,
        slippage,
        setSlippage,
        fairOverride,
        fairPriceLoc,
        fairPriceLocFTR,
        setFairOverride,
        setfairPriceLoc,
        setfairPriceLocFTR,
        text_B, setText_B,
        invisible1, setinvisible1,
        invisible2, setinvisible2,
        isClosingNewAccounts,
        isStrict,
        setIsStrict,
        setIsClosingNewAccounts,
        referral,
      }}
    >
      {props.children}
    </_SwapContext.Provider>
  );
}

export function useSwapContext(): SwapContext {
  const ctx = useContext(_SwapContext);
  if (ctx === null) {
    throw new Error("Context not available");
  }
  return ctx;
}



export function useSwapFair(): number | undefined {
  const { fairOverride, fromMint, toMint,fairPriceLoc,setfairPriceLoc } = useSwapContext();
  return _useSwapFair(fromMint, toMint, fairOverride,fairPriceLoc,setfairPriceLoc);
}

export function useFtrFair(): number  {
  const { fairOverride, fromMint, toMint,fairPriceLoc,setfairPriceLoc,fairPriceLocFTR,setfairPriceLocFTR } = useSwapContext();
  return _useFtrFair(fairPriceLocFTR,setfairPriceLocFTR);
}


function _useFtrFair(
fairPriceLocFTR:number,
setfairPriceLocFTR:(n:number)=>void

): number  {



  fetch(process.env.PUBLIC_URL + '/ftr_price.txt')
    .then(r => r.text())

    .then(text => {
      let arr_y=text.split('>');

      let fair_tmp=parseFloat(arr_y[1]);
      setfairPriceLocFTR(fair_tmp);
    });




return fairPriceLocFTR;
}


function _useSwapFair(
  fromMint: PublicKey,
  toMint: PublicKey,
  fairOverride: number | null,
  fairPriceLoc:number,
  setfairPriceLoc:(n:number)=>void,

): number | undefined {

  const fairRoute = useFairRoute(fromMint, toMint);

  let fair = fairOverride === null ? fairRoute : fairOverride;

  fetch(process.env.PUBLIC_URL + '/q_fixed_rate_contract.txt')
    .then(r => r.text())

    .then(text => {
      let arr_y=text.split('>');

      let fair_tmp=parseFloat(arr_y[1]);
      setfairPriceLoc(110/(1+fair_tmp));
    });




    console.log("fairPriceLoc");
    console.log(fairPriceLoc);
  if (fromMint.toString()=="7KTarZVHiek4oaxZSAb9rCy3vvRGRkMLTSjhni2eN9RZ" && toMint.toString()=="9K4oA2ZFNcVJuLTzEEpJcBg4zDJe5oWsHV8Dfg35mTks"){
    fair=1/fairPriceLoc;
    //console.log("Buy FR with USDC");
  }
  if (fromMint.toString()=="9K4oA2ZFNcVJuLTzEEpJcBg4zDJe5oWsHV8Dfg35mTks" && toMint.toString()=="7KTarZVHiek4oaxZSAb9rCy3vvRGRkMLTSjhni2eN9RZ"){
    fair=fairPriceLoc;
    //console.log("Sell FR for USDC");
  }



  return fair;
}

// Returns true if the user can swap with the current context.
export function useCanSwap(): boolean {
  const { fromMint, toMint, ftrMint, fromAmount, toAmount,fromFtrAmount,fairPriceLocFTR,setfairPriceLocFTR } = useSwapContext();
  const { swapClient } = useDexContext();
  const { wormholeMap, solletMap } = useTokenListContext();
  const fromWallet = useOwnedTokenAccount(fromMint);
  const fair = useSwapFair();
  const fair_ftr=_useFtrFair(fairPriceLocFTR,setfairPriceLocFTR);
  const route = useRouteVerbose(fromMint, toMint);
  if (route === null) {
    return false;
  }

  return (
    // From wallet exists.
    fromWallet !== undefined &&
    fromWallet !== null &&
    // Fair price is defined.
    fair !== undefined &&
    fair > 0 &&
    // Mints are distinct.
    fromMint.equals(toMint) === false &&
    // Wallet is connected.
    swapClient.program.provider.wallet.publicKey !== null &&
    // Trade amounts greater than zero.
    fromAmount > 0 &&
    toAmount > 0 &&
    // Trade route exists.
    route !== null &&
    // Wormhole <-> native markets must have the wormhole token as the
    // *from* address since they're one-sided markets.
    (route.kind !== "wormhole-native" ||
      wormholeMap
        .get(fromMint.toString())
        ?.tags?.includes(SPL_REGISTRY_WORM_TAG) !== undefined) &&
    // Wormhole <-> sollet markets must have the sollet token as the
    // *from* address since they're one sided markets.
    (route.kind !== "wormhole-sollet" ||
      solletMap
        .get(fromMint.toString())
        ?.tags?.includes(SPL_REGISTRY_SOLLET_TAG) !== undefined)
  );
}

export function useReferral(fromMarket?: Market): PublicKey | undefined {
  const { referral } = useSwapContext();
  const asyncReferral = useAsync(async () => {
    if (!referral) {
      return undefined;
    }
    if (!fromMarket) {
      return undefined;
    }
    if (
      !fromMarket.quoteMintAddress.equals(USDC_MINT) &&
      !fromMarket.quoteMintAddress.equals(USDT_MINT)
    ) {
      return undefined;
    }

    return Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      fromMarket.quoteMintAddress,
      referral
    );
  }, [fromMarket]);

  if (!asyncReferral.result) {
    return undefined;
  }
  return asyncReferral.result;
}
