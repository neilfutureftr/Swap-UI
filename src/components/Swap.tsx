import { useState } from "react";
import { useAsync } from "react-async-hook";
import { RandomIdl } from "./randomIdl";


const {
  sleep,
  getTokenAccount,
  createMint,
  createTokenAccount,
} = require("./utils");

const anchor = require("@project-serum/anchor");
import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  Signer,
} from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BN, Provider } from "@project-serum/anchor";
import {
  makeStyles,
  Card,
  Button,
  Typography,
  TextField,
  useTheme,
} from "@material-ui/core";
import { ExpandMore, ImportExportRounded } from "@material-ui/icons";
import { useSwapContext, useSwapFair } from "../context/Swap";
import {
  useDexContext,
  useOpenOrders,
  useRouteVerbose,
  useMarket,
  FEE_MULTIPLIER,
} from "../context/Dex";
import { useTokenMap } from "../context/TokenList";
import { useMint, useOwnedTokenAccount } from "../context/Token";
import { useCanSwap, useReferral } from "../context/Swap";
import TokenDialog from "./TokenDialog";
import { SettingsButton } from "./Settings";
import { InfoLabel } from "./Info";
import { InfoLabelFTR } from "./Info_FTR";
import { SOL_MINT, WRAPPED_SOL_MINT } from "../utils/pubkeys";

const useStyles = makeStyles((theme) => ({
  card: {
    width: theme.spacing(70),
    borderRadius: theme.spacing(2),
    boxShadow: "0px 0px 30px 5px rgba(0,0,0,0.075)",
    padding: theme.spacing(2),
  },
  tab: {
    width: "20%",
  },
  settingsButton: {
    padding: 0,
  },
  swapButton: {
    width: "100%",
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: 16,
    fontWeight: 700,
    padding: theme.spacing(1.5),
  },
  swapToFromButton: {
    display: "block",
    margin: "10px auto 10px auto",
    cursor: "pointer",
  },
  amountInput: {
    fontSize: 22,
    fontWeight: 600,
  },
  input: {
    textAlign: "right",
  },
  swapTokenFormContainer: {
    borderRadius: theme.spacing(2),
    boxShadow: "0px 0px 15px 2px rgba(33,150,243,0.1)",
    display: "flex",
    justifyContent: "space-between",
    margin: "10px auto 10px auto",
    padding: theme.spacing(1),
  },
  swapTokenSelectorContainer: {
    marginLeft: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    width: "50%",
  },
  balanceContainer: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
  },
  maxButton: {
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.main,
    fontWeight: 700,
    fontSize: "12px",
    cursor: "pointer",
  },
  tokenButton: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    marginBottom: theme.spacing(1),
  },
}));

export default function SwapCard({
  containerStyle,
  contentStyle,
  swapTokenContainerStyle,
}: {
  containerStyle?: any;
  contentStyle?: any;
  swapTokenContainerStyle?: any;
}) {
  const styles = useStyles();
  return (
    <Card className={styles.card} style={containerStyle}>
      <SwapHeader />
      <div style={contentStyle}>
        <SwapFromForm style={swapTokenContainerStyle} />
        <SwapFromFTR style={swapTokenContainerStyle} />
        <ArrowButton />
        <SwapToForm style={swapTokenContainerStyle} />
        <SwapToFTRForm style={swapTokenContainerStyle} />
        <InfoLabel />
        <InfoLabelFTR />
        <SwapButton />
      </div>
    </Card>
  );
}

export function SwapHeader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
        backgroundColor: "white",
      }}
    >
      <Typography
        style={{
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        FTR PRODUCT DISTRIBUTOR
      </Typography>
      <SettingsButton />
    </div>
  );
}

export function ArrowButton() {
  const styles = useStyles();
  const theme = useTheme();
  const { swapToFromMints } = useSwapContext();
  return (
    <ImportExportRounded
      className={styles.swapToFromButton}
      fontSize="large"
      htmlColor={theme.palette.primary.main}
      onClick={swapToFromMints}
    />
  );
}

function SwapFromForm({ style }: { style?: any }) {
  const { fromMint, setFromMint, fromAmount, setFromAmount } = useSwapContext();
  return (
    <SwapTokenForm
      from
      style={style}
      mint={fromMint}
      setMint={setFromMint}
      amount={fromAmount}
      setAmount={setFromAmount}
    />
  );
}




function SwapFromFTR({ style }: { style?: any }) {
  const { ftrMint, setFromFtrMint, fromFtrAmount, setFromFtrAmount,invisible1 } = useSwapContext();
  return (
    <SwapTokenFormModif
      from
      style={style}
      mint={ftrMint}
      setMint={setFromFtrMint}
      amount={fromFtrAmount}
      setAmount={setFromFtrAmount}
      disabled={invisible1}
    />
  );
}

function SwapToForm({ style }: { style?: any }) {
  const { toMint, setToMint, toAmount, setToAmount } = useSwapContext();
  return (
    <SwapTokenForm
      from={false}
      style={style}
      mint={toMint}
      setMint={setToMint}
      amount={toAmount}
      setAmount={setToAmount}

    />
  );
}


function SwapToFTRForm({ style }: { style?: any }) {
  const { ftrMint, setToFtrMint, toFtrAmount, setToFtrAmount,invisible2 } = useSwapContext();
  return (
    <SwapTokenFormModif
      from={false}
      style={style}
      mint={ftrMint}
      setMint={setToFtrMint}
      amount={toFtrAmount}
      setAmount={setToFtrAmount}
      disabled={invisible2}
    />
  );
}


  export function SwapTokenFormModif({
    from,
    style,
    mint,
    setMint,
    amount,
    setAmount,
    disabled,
  }: {
    from: boolean;
    style?: any;
    mint: PublicKey;
    setMint: (m: PublicKey) => void;
    amount: number;
    setAmount: (a: number) => void;
    disabled:boolean
  }) {
    const styles = useStyles();

    const [showTokenDialog, setShowTokenDialog] = useState(false);
    const tokenAccount = useOwnedTokenAccount(mint);
    const mintAccount = useMint(mint);

    const balance =
      tokenAccount &&
      mintAccount &&
      tokenAccount.account.amount.toNumber() / 10 ** mintAccount.decimals;

    const formattedAmount =
      mintAccount && amount
        ? amount.toLocaleString("fullwide", {
            maximumFractionDigits: mintAccount.decimals,
            useGrouping: false,
          })
        : amount;
    if (disabled) return (<div></div>);
    return (
      <div className={styles.swapTokenFormContainer} style={style}>
        <div className={styles.swapTokenSelectorContainer}>
          <TokenButton mint={mint} onClick={() => setShowTokenDialog(true)} />
          <Typography color="textSecondary" className={styles.balanceContainer}>
            {tokenAccount && mintAccount
              ? `Balance: ${balance?.toFixed(mintAccount.decimals)}`
              : `-`}
            {from && !!balance ? (
              <span
                className={styles.maxButton}
                onClick={() => setAmount(balance)}
              >
                MAX
              </span>
            ) : null}
          </Typography>
        </div>
        <TextField
          type="number"
          value={formattedAmount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          InputProps={{
            disableUnderline: true,
            classes: {
              root: styles.amountInput,
              input: styles.input,
            },
          }}
        />

      </div>
    );
  }


  export function SwapTokenForm({
    from,
    style,
    mint,
    setMint,
    amount,
    setAmount,
  }: {
    from: boolean;
    style?: any;
    mint: PublicKey;
    setMint: (m: PublicKey) => void;
    amount: number;
    setAmount: (a: number) => void;

  }) {
    const styles = useStyles();

    const [showTokenDialog, setShowTokenDialog] = useState(false);
    const tokenAccount = useOwnedTokenAccount(mint);
    const mintAccount = useMint(mint);

    const balance =
      tokenAccount &&
      mintAccount &&
      tokenAccount.account.amount.toNumber() / 10 ** mintAccount.decimals;

    const formattedAmount =
      mintAccount && amount
        ? amount.toLocaleString("fullwide", {
            maximumFractionDigits: mintAccount.decimals,
            useGrouping: false,
          })
        : amount;

    return (
      <div className={styles.swapTokenFormContainer} style={style}>
        <div className={styles.swapTokenSelectorContainer}>
          <TokenButton mint={mint} onClick={() => setShowTokenDialog(true)} />
          <Typography color="textSecondary" className={styles.balanceContainer}>
            {tokenAccount && mintAccount
              ? `Balance: ${balance?.toFixed(mintAccount.decimals)}`
              : `-`}
            {from && !!balance ? (
              <span
                className={styles.maxButton}
                onClick={() => setAmount(balance)}
              >
                MAX
              </span>
            ) : null}
          </Typography>
        </div>
        <TextField
          type="number"
          value={formattedAmount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          InputProps={{
            disableUnderline: true,
            classes: {
              root: styles.amountInput,
              input: styles.input,
            },
          }}
        />

      </div>
    );
  }

function TokenButton({
  mint,
  onClick,
}: {
  mint: PublicKey;
  onClick: () => void;
}) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <div onClick={onClick} className={styles.tokenButton}>
      <TokenIcon mint={mint} style={{ width: theme.spacing(4) }} />
      <TokenName mint={mint} style={{ fontSize: 14, fontWeight: 700 }} />
      <ExpandMore />
    </div>
  );
}

export function TokenIcon({ mint, style }: { mint: PublicKey; style: any }) {
  const tokenMap = useTokenMap();
  let tokenInfo = tokenMap.get(mint.toString());
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {tokenInfo?.logoURI ? (
        <img alt="Logo" style={style} src={tokenInfo?.logoURI} />
      ) : (
        <div style={style}></div>
      )}
    </div>
  );
}

function TokenName({ mint, style }: { mint: PublicKey; style: any }) {
  const tokenMap = useTokenMap();
  const theme = useTheme();
  let tokenInfo = tokenMap.get(mint.toString());

  return (
    <Typography
      style={{
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(1),
        ...style,
      }}
    >
      {tokenInfo?.symbol}
    </Typography>
  );
}

export function SwapButton() {
  const styles = useStyles();
  const {
    fromMint,
    toMint,
    fromAmount,
    slippage,
    isClosingNewAccounts,
    isStrict,fairPriceLoc,text_B,setText_B
  } = useSwapContext();
  const { swapClient } = useDexContext();
  const fromMintInfo = useMint(fromMint);
  const toMintInfo = useMint(toMint);
  const route = useRouteVerbose(fromMint, toMint);
  const fromMarket = useMarket(
    route && route.markets ? route.markets[0] : undefined
  );
  const toMarket = useMarket(
    route && route.markets ? route.markets[1] : undefined
  );
  let canSwap = useCanSwap();
  canSwap=true;

  const fair = useSwapFair();
  let fromWallet = useOwnedTokenAccount(fromMint);
  let toWallet = useOwnedTokenAccount(toMint);
  const quoteMint = fromMarket && fromMarket.quoteMintAddress;
  const quoteMintInfo = useMint(quoteMint);
  const quoteWallet = useOwnedTokenAccount(quoteMint);

  // Click handler.
  const sendSwapTransaction = async () => {



    const programId = new PublicKey(
      "D6CJs1GE1MZqEV4kGnbWzvYJUDnQQ9iyEnpk4LdgQuBq",
    );
    const connection = new Connection("https://api.testnet.solana.com", {
      commitment: "processed",
    });

    const provider = new anchor.Provider(connection, swapClient.program.provider.wallet, {
      commitment: "processed",
    });

    let authority=swapClient.program.provider.wallet.publicKey

    const program = new anchor.Program(RandomIdl, programId, provider);

    console.log(program, "Is Anchor Working?");


      let ftrlock_modifier_multiplier=1000
    let ftr_token_multiplier=100000;
    let usdc_token_multiplier=100000;
    let fr_token_multiplier=100000;
    let price_modifier_multiplier=100;


    const ftr_per_contract=new anchor.BN(1.230*ftrlock_modifier_multiplier);
    const fixed_rate_price_buy=new anchor.BN(102.12*price_modifier_multiplier);
    const fixed_rate_price_sell=new anchor.BN(102.12*price_modifier_multiplier);


    const pk_ftrMint=new anchor.web3.PublicKey("9wiekAjc9Gonb9Cj31ophc3mNytvGbWtUPmDT7RfC2j4");
    const pk_usdMint=new anchor.web3.PublicKey("5oGBr1rb8WTb9MQzGJgsURXnukw2vxfQq4CDKbYKZBTN");
    const pk_fixedRateMint=new anchor.web3.PublicKey("CHak5WRLnusVkvmNRposBP1nf5AgFatuzB2QbWinRMPg");


    const pk_poolAccount=new anchor.web3.PublicKey("E22fFwBG6KKoiPRaTNSyurKre1CiiQVXg5svp1yZmHga");
    const pk_poolSignerAccount=new anchor.web3.PublicKey("9QV1MmiyWt6g1oNKeMCXLbsBr9EaJbmCXZ6BFvMFykhU");



      const pk_userUsdc=new anchor.web3.PublicKey("C8PSKRGY5veurYrcryW3P5D5NnWUqnBYrL8JcJ4Cdp6T");
      const pk_poolUsdc=new anchor.web3.PublicKey("2yALwJydgyPwnbSUWzGJKuePEr4ywhUwvBKJ3RL3uZ7q");
      const pk_userFtr=new anchor.web3.PublicKey("Bat29UWEeL1RotewFWHgu1NydarUBpehAJ3MrawKeGv6");
      const pk_poolFtr=new anchor.web3.PublicKey("HvGkE2EPL1fEMYyfJBLentHtKHkSRziNDkPceTHAJvMK");
      const pk_userFixedRate=new anchor.web3.PublicKey("BxzXJYuQZ6aifEffk6uDGerEmsE56fVD6YbRrdv9PVL3");
      const pk_poolFixedRate=new anchor.web3.PublicKey("Bbe7TCFPrnRdBRePSrUHguUnuXw27tC3qyCD6SaUhVwk");



    if (false){
      const pk_userUsdc=new anchor.web3.PublicKey(require('fs').readFileSync('userUsdc_pk.txt', 'utf8'));
      const pk_poolUsdc=new anchor.web3.PublicKey(require('fs').readFileSync('poolUsdc_pk.txt', 'utf8'));
      const pk_userFtr=new anchor.web3.PublicKey(require('fs').readFileSync('userFtr_pk.txt', 'utf8'));
      const pk_poolFtr=new anchor.web3.PublicKey(require('fs').readFileSync('poolFtr_pk.txt', 'utf8'));
      const pk_userFixedRate=new anchor.web3.PublicKey(require('fs').readFileSync('userFixedRate_pk.txt', 'utf8'));
      const pk_poolFixedRate=new anchor.web3.PublicKey(require('fs').readFileSync('poolFixedRate_pk.txt', 'utf8'));


    }
    let ftrMint = pk_ftrMint;
    let usdcMint = pk_usdMint;

    let fixedRateMint = pk_fixedRateMint;
    let poolAccountPK= pk_poolAccount;





    let poolFtr = pk_poolFtr
    let userFtr = pk_userFtr
    let poolUsdc = pk_poolUsdc
    let userUsdc = pk_userUsdc
    let poolFixedRate = pk_poolFixedRate
    let userFixedRate = pk_userFixedRate






  const [user, bump] = await PublicKey.findProgramAddress(
        [authority.toBuffer()],
        program.programId
      );


      if (false){
      await program.rpc.createUser( bump, {
            accounts: {
              user,
              authority,
              systemProgram: anchor.web3.SystemProgram.programId,
            },
          });
       console.log("Successfully created user ");
      }else{
        console.log("User was already created ");
      }

    const [_poolSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
      [fixedRateMint.toBuffer()],
      program.programId
    );
  let poolSigner=_poolSigner;

  const account = await program.account.user.fetch(user);

  console.log("Done reloading stuff")

  const initial_FTR_in_account = new anchor.BN(100);
  const initial_USDC_in_account = new anchor.BN(1_000);
  const initial_FR_in_pool = new anchor.BN(100);




  const poolAccount_l = await program.account.poolAccount.fetch(poolAccountPK);





  let poolFtrAccount = await getTokenAccount(provider, poolFtr);
  let userFtrAccount = await getTokenAccount(provider, userFtr);

  let poolUsdcAccount = await getTokenAccount(provider, poolUsdc);
  let userUsdcAccount = await getTokenAccount(provider, userUsdc);

  let poolFixedRateAccount = await getTokenAccount(provider, poolFixedRate);
  let userFixedRateAccount = await getTokenAccount(provider, userFixedRate);

  console.log("USDC in the USDC pool")
  console.log((poolUsdcAccount.amount/usdc_token_multiplier).toString());
  console.log("FTR in the FTR pool")
  console.log((poolFtrAccount.amount/ftr_token_multiplier).toString());
  console.log("FixedRate in the FixedRate pool")
  console.log((poolFixedRateAccount.amount/ftr_token_multiplier).toString());

  console.log("USDC in the user USDC wallet")
  console.log((userUsdcAccount.amount/usdc_token_multiplier).toString())
  console.log("FTR in the user FTR wallet")
  console.log((userFtrAccount.amount/ftr_token_multiplier).toString())
  console.log("FixedRate in the user FixedRate wallet")
  console.log((userFixedRateAccount.amount/fr_token_multiplier).toString())



  console.log("----------PURCHASING 1.2 FIXED RATE -----------")
  let number_of_fr=1;
  const expected_usdc_to_spend=new anchor.BN(number_of_fr*fr_token_multiplier/price_modifier_multiplier*fixed_rate_price_buy);
  const expected_FR_to_receive=new anchor.BN(number_of_fr*fr_token_multiplier/price_modifier_multiplier);
  const expected_FTR_to_send=new anchor.BN(ftr_per_contract*expected_FR_to_receive/fr_token_multiplier*ftr_token_multiplier);


  await program.rpc.getFixedRate(
      expected_usdc_to_spend,
      expected_FTR_to_send,
      expected_FR_to_receive,{
      accounts: {

      poolAccount: poolAccountPK,
      userAuthority: provider.wallet.publicKey,
      poolSigner,
      user,

      poolUsdc,
      poolFtr,
      poolFixedRate,
      userUsdc,
      userFtr,
      userFixedRate,
      tokenProgram: TOKEN_PROGRAM_ID,
      clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    },

    }

    )


  poolFtrAccount = await getTokenAccount(provider, pk_poolFtr);
  userFtrAccount = await getTokenAccount(provider, pk_userFtr);

  poolUsdcAccount = await getTokenAccount(provider, pk_poolUsdc);
  userUsdcAccount = await getTokenAccount(provider, pk_userUsdc);

  poolFixedRateAccount = await getTokenAccount(provider, pk_poolFixedRate);
  userFixedRateAccount = await getTokenAccount(provider, pk_userFixedRate);

  console.log("----------CHECKING STATES FIXED RATE -----------")

  console.log("USDC in the USDC pool")
  console.log((poolUsdcAccount.amount/usdc_token_multiplier).toString());
  console.log("FTR in the FTR pool")
  console.log((poolFtrAccount.amount/ftr_token_multiplier).toString());
  console.log("FixedRate in the FixedRate pool")
  console.log((poolFixedRateAccount.amount/ftr_token_multiplier).toString());

  console.log("USDC in the user USDC wallet")
  console.log((userUsdcAccount.amount/usdc_token_multiplier).toString())
  console.log("FTR in the user FTR wallet")
  console.log((userFtrAccount.amount/ftr_token_multiplier).toString())
  console.log("FixedRate in the user FixedRate wallet")
  console.log((userFixedRateAccount.amount/fr_token_multiplier).toString())


  const number_of_contract_to_redeem = 1;

  const expected_FR_to_spend=new anchor.BN(number_of_contract_to_redeem*fr_token_multiplier/price_modifier_multiplier);

  console.log("-------------Redeeming Fixed Rate-----------")



  await program.rpc.redeemFixedRate(expected_FR_to_spend,{
      accounts: {
      poolAccount: poolAccountPK,

      poolSigner,

      userAuthority: provider.wallet.publicKey,
      user,
      poolFtr,
      poolFixedRate,
      poolUsdc,
      userFtr,
      userUsdc,
      userFixedRate,
      tokenProgram: TOKEN_PROGRAM_ID,
      clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    },

    }

    )


  poolFtrAccount = await getTokenAccount(provider, pk_poolFtr);
  userFtrAccount = await getTokenAccount(provider, pk_userFtr);

  poolUsdcAccount = await getTokenAccount(provider, pk_poolUsdc);
  userUsdcAccount = await getTokenAccount(provider, pk_userUsdc);

  poolFixedRateAccount = await getTokenAccount(provider, pk_poolFixedRate);
  userFixedRateAccount = await getTokenAccount(provider, pk_userFixedRate);

  console.log("----------CHECKING STATES FIXED RATE -----------")

  console.log("USDC in the USDC pool")
  console.log((poolUsdcAccount.amount/usdc_token_multiplier).toString());
  console.log("FTR in the FTR pool")
  console.log((poolFtrAccount.amount/ftr_token_multiplier).toString());
  console.log("FixedRate in the FixedRate pool")
  console.log((poolFixedRateAccount.amount/ftr_token_multiplier).toString());

  console.log("USDC in the user USDC wallet")
  console.log((userUsdcAccount.amount/usdc_token_multiplier).toString())
  console.log("FTR in the user FTR wallet")
  console.log((userFtrAccount.amount/ftr_token_multiplier).toString())
  console.log("FixedRate in the user FixedRate wallet")
  console.log((userFixedRateAccount.amount/fr_token_multiplier).toString())



  };
  console.log("CREATING BUTTON");
  console.log(fair);
  let message="Waiting for info"
  if(fair!=undefined){
  if(fair>1){
    message="Buy Quarterly Fixed Rate"
  }else{
    message="Redeem Quarterly Fixed Rate"
  }
}
  console.log(message);
  return (
    <Button
      variant="contained"
      className={styles.swapButton}
      onClick={sendSwapTransaction}
      disabled={!canSwap}
    //  textTransform={setText_B}
    >
      {message}
    </Button>
  );

}

async function wrapSol(
  provider: Provider,
  wrappedSolAccount: Keypair,
  fromMint: PublicKey,
  amount: BN
): Promise<{ tx: Transaction; signers: Array<Signer | undefined> }> {
  const tx = new Transaction();
  const signers = [wrappedSolAccount];
  // Create new, rent exempt account.
  tx.add(
    SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: wrappedSolAccount.publicKey,
      lamports: await Token.getMinBalanceRentForExemptAccount(
        provider.connection
      ),
      space: 165,
      programId: TOKEN_PROGRAM_ID,
    })
  );
  // Transfer lamports. These will be converted to an SPL balance by the
  // token program.
  if (fromMint.equals(SOL_MINT)) {
    tx.add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: wrappedSolAccount.publicKey,
        lamports: amount.toNumber(),
      })
    );
  }
  // Initialize the account.
  tx.add(
    Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      WRAPPED_SOL_MINT,
      wrappedSolAccount.publicKey,
      provider.wallet.publicKey
    )
  );
  return { tx, signers };
}

function unwrapSol(
  provider: Provider,
  wrappedSolAccount: Keypair
): { tx: Transaction; signers: Array<Signer | undefined> } {
  const tx = new Transaction();
  tx.add(
    Token.createCloseAccountInstruction(
      TOKEN_PROGRAM_ID,
      wrappedSolAccount.publicKey,
      provider.wallet.publicKey,
      provider.wallet.publicKey,
      []
    )
  );
  return { tx, signers: [] };
}
