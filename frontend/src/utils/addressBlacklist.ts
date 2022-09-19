import { getAddress } from 'ethers/lib/utils';

import type { EthereumAddress } from '@/types/data';

export const isAddressBlacklisted = (
  address: EthereumAddress,
  blacklist: EthereumAddress[] = BLACKLIST_ADDRESSES,
) => {
  return blacklist.includes(getAddress(address));
};

export const BLACKLIST_ADDRESSES = [
  '0x000000000000000000000000000000000000dEaD',
  '0x009988Ff77eEaa00051238ee32C48f10a174933E',
  '0x01Cb0Af7BFBB431426FeE85A7065149B60D2bdBc',
  '0x020f5b9a66536AF1E67a08804BD49F0d9F532a58',
  '0x022B5b0229bD1eFB64A6fECfeC607aB35E9b56f1',
  '0x03893a7c7463AE47D46bc7f091665f1893656003',
  '0x03Cf40B900971561AC6bd997ef1Fe939DcbC95e2',
  '0x03D3d1A901b5668AeD6b21c0BCD24A5ECe5294F1',
  '0x05416A6b42A5685A0127c347eE65F625E455B885',
  '0x070B71D3EBA1956A90253496C82a7948Eb7Ef28f',
  '0x07687e702b410Fa43f4cB4Af7FA097918ffD2730',
  '0x0836222F2B2B24A3F36f98668Ed8F0B38D1a872f',
  '0x098B716B8Aaf21512996dC57EB0615e2383E2f96',
  '0x0E61A8fb14f6AC999646212D30b2192cd02080Dd',
  '0x0aCa56900E20696749DfDb76147b08ABb1b1019D',
  '0x0aE1554860E51844B61AE20823eF1268C3949f7C',
  '0x0d043128146654C7683Fbf30ac98D7B2285DeD00',
  '0x10959926fb4926D181a2ea46CeB234150Ab70C9B',
  '0x11656A7aD11fB6b1B32DBa47c137409429E12d61',
  '0x11B3544828b358cd528e72a9f7ffb7212fc3fb85',
  '0x12C22bEFC4e0C7E00C2c6618A05e93B737ad2dF0',
  '0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc',
  '0x133d1c7e206f8D864b215E49917Da32E566Cf014',
  '0x1356c899D8C9467C7f71C195612F8A395aBf2f0a',
  '0x1588afd4da044a607f3085C0844510a79E3Ab0c2',
  '0x15A78BbF8be505d11B88Abdf035bf2633e8288eA',
  '0x165460Ae039Ad855f19AAC6c68744e5E912eBf8e',
  '0x169AD27A470D064DEDE56a2D3ff727986b15D52B',
  '0x178169B423a011fff22B9e3F3abeA13414dDD0F1',
  '0x17B912e9352B5201a42f8455651ae7CeE91c4060',
  '0x1BCB469ec6ef3D3655a27Bb7de2e86e0f1937122',
  '0x1DaCA153B294D4bbcE075EC3553A5F9d43769182',
  '0x1EECA807877D4682aD02930960c297D7456Fb155',
  '0x1c5dCdd006EA78a7E4783f9e6021C32935a10fb4',
  '0x217e76555A1f1A3F591e8d12668d42C5394e441e',
  '0x22aaA7720ddd5388A3c0A3333430953C68f1849b',
  '0x23773E65ed146A459791799d01336DB287f25334',
  '0x23aB3F12C2E6CB22926886EcD0fDbfDA275cb1D7',
  '0x25C77AafbCcCE15cEEc211B483928BE70Efc2BAD',
  '0x25fb126B6c6B5c8EF732b86822fA0F0024E16C61',
  '0x266c97351C81eADB56D0A291b2F7fEb961922e67',
  '0x270CDd950e9de59373f5aD7E335A587026a42057',
  '0x2717c5e28cf931547B621a5dddb772Ab6A35B701',
  '0x28733543ec21DFD4Dac3FA2d7AD74d6c6d2Bb49d',
  '0x2973e77A8e60B6a1313A30687e979741Ed559AA7',
  '0x2AEFA879b37B6d40a71DD2d83EE0Ed9231b6d587',
  '0x2f13b177DDB2173A2DA9D3c33bD830d0574Bb7a4',
  '0x3042e8BD858DA539A793efD0E1F0dEce9C60B460',
  '0x3238B53A910B69f5dBDb31786613cE944536BA19',
  '0x33d5CC43deBE407d20dD360F4853385135f97E9d',
  '0x3538E35A031B1AD41cc6890749858841192EB7a5',
  '0x35679E61E5946F711ca1288255B1F32376C416D7',
  '0x36d97147cF8E1B75254748Cf0A102316fCc61697',
  '0x38d45371993eEc84f38FEDf93C646aA2D2267CEA',
  '0x3CB642b8c7298EAA1Fd1509F389d2060850474E2',
  '0x3E921E9839c4795C05ca20284143Eca2254bD4Ae',
  '0x3E9f1D6E244D773360dcE4ca88ab3C054F502D51',
  '0x3d6e4E2e1748628Ed053A831C03B8189c37b6f23',
  '0x3e3Da032591d4471E7Ca1a6d588D64bC36e232f4',
  '0x4081c2e9338Aab51480acBb34f6664e32509b9F7',
  '0x417f07DaaBCb952b982261670E1A401800Ee3C4b',
  '0x41aD2bc63A2059f9b623533d87fe99887D794847',
  '0x4469496CB1aFfb108cb0A2D13C58DB29B4282303',
  '0x4548A20CAd4707Cbd38c205079bD9eD3c88aE103',
  '0x45FB09468B17D14D2b9952bC9Dcb39EE7359e64d',
  '0x45f828c9cDf410C520eCc96CE6054EFba671bfdC',
  '0x46340b20830761efd32832A74d7169B29FEB9758',
  '0x4642D9D9A434134CB005222eA1422e1820508d7B',
  '0x4736dCf1b7A3d580672CcE6E7c65cd5cc9cFBa9D',
  '0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3c2936',
  '0x47ca15f1E2bE671B0B26C2599A25F3e012a1A7ca',
  '0x48e4dd3e356823070D9d1B7d162d072aE9EFE0Cb',
  '0x4b936321b0E3E2d919412502B6aDA09E9b7d484b',
  '0x4ca95a67BE867787b01Ef7685aeE6A73b3070E9F',
  '0x4dB9ef1dAf5Cb18EB778C134d69B1E67000fB8d2',
  '0x51841D9AFe10fE55571bDB8f4Af1060415003528',
  '0x526232F70b97938E19394e57BC5eE1d5d929074e',
  '0x527653eA119F3E6a1F5BD18fbF4714081D7B31ce',
  '0x53B24Bc4A57c302304e28cd4D86a72CB0cA465D5',
  '0x58E8dCC13BE9780fC42E8723D8EaD4CF46943dF2',
  '0x59932C8e0B3cf2D9f890bB5F4D30291086E651F9',
  '0x5D32b87A43a2bd1f7df209d2F475b165d2c09E24',
  '0x5D6FDf5C8A1eA9FC3A92e53D6b4B83114af51340',
  '0x5beD938a15BFf19907985b0caa725F7f89Ec31b1',
  '0x5c154585cAA1aEcDA5842f576Fe76Ef95beE7f75',
  '0x5d88C2C5a93d147e845f0146D27537FfD881c867',
  '0x5e1870f3f6E0603b3CfE26Eb4AC9b42ab3FfEA03',
  '0x5eE42438d0D8fc399C94ef3543665E993e847b49',
  '0x608F56fe8C90abcF13c6E81eE5086F6B7A0aa365',
  '0x610B717796ad172B316836AC95a2ffad065CeaB4',
  '0x61145f7bda6BDd4aF00c57A7C628235c6d7e5ad0',
  '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
  '0x629e7Da20197a5429d30da36E77d06CdF796b71A',
  '0x63341Ba917De90498F3903B199Df5699b4a55AC0',
  '0x64C4c819750aEaA30461EcF5B2fb9FB95EE9C946',
  '0x66666600E43c6d9e1a249D29d58639DEdFcD9adE',
  '0x666bED4762790FAB9fB6D9635ab5A009d4D5D216',
  '0x6887444a5B74B746F56ae08952f4e1B404ff7ca5',
  '0x6Ac5536d097DFBF8b900b137d2CfA60bDC5939D4',
  '0x6a164122d5cf7c840D26e829b46dCc4ED6C0ae48',
  '0x6dd998e522a773A9DB8Db66BD3fD0d2b5629F9B4',
  '0x6f7f2f0a860f83269f509cEd88624282e094cced',
  '0x70473400Add568bB3362B84F1F44147194A0A679',
  '0x70DcF33Ca09bd87bb2A301280331406ebD32C8A0',
  '0x722122dF12D4e14e13Ac3b6895a86e84145b6967',
  '0x730D7e40a1f012Ea57e957F5E9736c797b282A36',
  '0x732DE7495DeECaE6424C3fC3c46E47D6B4c5374E',
  '0x75912Da145cA00092AF317F8c3A84073A5665256',
  '0x76484D49a08ADF8BF1AbC7A6FdD35eaf13e19336',
  '0x765AE31119D7F56B0179Ae28917f8F2B49eBaE13',
  '0x7693c3545667309F112EB2d1A0d7BDfCFc536411',
  '0x772308A6baf2aEeE106b88BE66cBd3efF7c6a064',
  '0x78f9848C8141652Db73B78DB72E2a028c0037503',
  '0x7952641c3892a6F79Fb5cA8B8d980827eE948459',
  '0x7D63203cF8f6f4C0570C7E0c4DE38B78a7155AA9',
  '0x7E0dAdC0dD0d74b4d9E49D14A865765F47121476',
  '0x7Ec1734FDc65fC3c310f38781a0427Bb65B82107',
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  '0x7a380d1C185A520aE1ab29707BDBbE2fB081488D',
  '0x7b792E49f640676B3706d666075E903B3A4deEc6',
  '0x7ff9cfad3877f21d41da833e2f775db0569ee3d9',
  '0x8006f98f33f8cF4156C36256Cd0866250C753D26',
  '0x801b68Cc9f4fB094A28b30CA25664051e50AD3A9',
  '0x8057a2a2Db9FF72207Fbc16Fd95a609A696474C9',
  '0x8318FafbC2F579e4FcDccefbA4542EC543059B0C',
  '0x8589427373D6D84E98730D7795D8f6f8731FDA16',
  '0x8748DE69768b52ab5F6a9BADBB910EEe68264Ad0',
  '0x877eECC3Ae4Bb28f048c16CD65A44cDE025345a1',
  '0x8867F3Da0E1bfbDC5b68AacB73aC44A5ab318C4e',
  '0x8A092D6835Ef0A3Eab726dA89DCF7Ed6832a3de2',
  '0x8b13c4F0Be1c798E0A594a11EDcFCa21C0c59d1e',
  '0x8c61192179275ecb435A6CE9bbE8B9FfCF7963C4',
  '0x8d92Ca432FC474C9CF5E56203a7E5fb752326D35',
  '0x8e206623923feF5311486AbdF7FA4B987cDbC816',
  '0x8f1E36A2f9313395e4f46e2b9073dCd9c382a5Aa',
  '0x905b63Fff465B9fFBF41DeA908CEb12478ec7601',
  '0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF',
  '0x924F17026aB7e01147F892c3684c85F758775701',
  '0x934dd62782BFe4a8E3f096E014266e5F5adc1b2a',
  '0x935BA0Bd43eA70148BD7baD8eebF28B778FdD16C',
  '0x947E178Fc37b35006A3AC027b2CE3E618dE47f2c',
  '0x94A1B5CdB22c43faab4AbEb5c74999895464Ddaf',
  '0x957cD4Ff9b3894FC78b5134A8DC72b032fFbC464',
  '0x95B18dD40867B0Fc79657ef66a2c7f3aD5DD23DF',
  '0x9634445e293A87aB77Ca3Cf5B43da94AaBc544B6',
  '0x9740E8Eaa04696BD3C3C712B3268625E6cC7F850',
  '0x9798a6DB2165624b367ab2Da32Fc676594B4Ceb2',
  '0x982E49cb023BBdBdC7D5Dd8B867fC83cB2c0DEf4',
  '0x998a5d74223ec9f848c5946db26aA73db42eC33B',
  '0x9AD122c22B14202B4490eDAf288FDb3C7cb3ff5E',
  '0x9BDEb450375770cFBd5C86c740d3bDB8fc980e5f',
  '0x9D4B3553f7F615ff0315711e31A41500EBDfFA13',
  '0x9a1C383aBbca270bF956070306Eda949ff9f1933',
  '0x9d7749E2c78eFE89F4442Cc3aa61f50527A433Bf',
  '0x9fAE13De16D34873246e48b514fc88581751533f',
  '0x9fd31424CfcEAb50218906BC1b3d87fe7778CA61',
  '0xA14c28D19007Da81bC0De5be416cba0ca5961e0C',
  '0xA160cdAB225685dA1d56aa342Ad8841c3b53f291',
  '0xA432C0081307733e801Ea7877e725F4E0adfbBfF',
  '0xA60C772958a3eD56c1F15dD055bA37AC8e523a0D',
  '0xA80163e183Af5E7530d708dbC9080d90Cefc60c7',
  '0xAF81A82cCe1d341d4E3e9586357E44513B1585E9',
  '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  '0xB0a60eBA24f6CF18CFDED0672c5C7a7529DcC342',
  '0xB3764761E297D6f121e79C32A65829Cd1dDb4D32',
  '0xB895099deF13c4d9cF6A75aA645EEf5F67b717Be',
  '0xBA214C1c1928a32Bffe790263E38B4Af9bFCD659',
  '0xBDB3C649e2CC7922E46795dcfAaFB864BE934543',
  '0xBa76ad1157E91c9528054eDE7Db6d37fd6bE9241',
  '0xBdb785AFB769AADC910fB73503221da890d8A074',
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  '0xC263EdD593AE7478Deb885C2600104Eda948c9e8',
  '0xC2D7CF95645D33006175B78989035C7c9061d3F9',
  '0xC7b20DC1E847EdfB5aDFC46084F2b290351ec77C',
  '0xC8a65Fadf0e0dDAf421F28FEAb69Bf6E2E589963',
  '0xCA23EFD643660D5502c9096464E465d9C06Ff56C',
  '0xCa0840578f57fE71599D29375e16783424023357',
  '0xD12FBbC8f17D2d461bA8D471A0D4c4d8fffb7922',
  '0xD21be7248e0197Ee08E0c20D4a96DEBdaC3D20Af',
  '0xD3749a3c9e0DCc9Ea9CCF07D89b2B621db8312f9',
  '0xD4B88Df4D29F5CedD6857912842cff3b20C8Cfa3',
  '0xD57859EA9B4a546a4069104C00431F2199EC1ffD',
  '0xD691F27f38B395864Ea86CfC7253969B409c362d',
  '0xD70493093eff8d7C136AB7A01be2c8065e2Cb82F',
  '0xDCc8A38A3a1f4eF4d0b4984dCBB31627D0952C28',
  '0xDD4c48C0B24039969fC16D1cdF626eaB821d3384',
  '0xDFB81A8663Df23bc59Ba75B60B99015f3F7aE725',
  '0xDefC385D7038f391Eb0063C2f7C238cFb55b206C',
  '0xE1Ddc57A5D24E3B8EeFF4f2c237B8e6666c064e3',
  '0xE434eF8F760F03554A9eD8a5c91D031011d768d8',
  '0xE4fE61197240D2Ea65eDab2710E45Dae0ea0De78',
  '0xE96D65Ec7C8856114878300697a3e5052de194ff',
  '0xE9BaA3f28dF9D0646FA872B9C3CA2B9b14aeEED5',
  '0xEA519e70EC8249CA07e43C2DD66279e23942B496',
  '0xEAAf68dDF2864e303604fffAF47a8d9Dd47E5E68',
  '0xEB6955cF773De10Da86FF7d78AF91c163818B8D2',
  '0xEaB911ae50da8CEC51d7C5EbfDa347BDbE9C838c',
  '0xF16E2F24215eCFB3f4bb6E719121F2537B48d5f7',
  '0xF47bfCcA712ef97C2F29b3e6723B21d7A37392f9',
  '0xF60dD140cFf0706bAE9Cd734Ac3ae76AD9eBC32A',
  '0xF67721A2D8F736E75a49FdD7FAd2e31D8676542a',
  '0xFBb1b73C4f0BDa4f67dcA266ce6Ef42f520fBB98',
  '0xFD8610d20aA15b7B2E3Be39B396a1bC3516c7144',
  '0xa0e1c89Ef1a489c9C7dE96311eD5Ce5D32c20E4B',
  '0xa1061D3B77b3f72f7c41f43fdC7c177E0029ed74',
  '0xa147b99A0E3F1373300F48faf1A1aAC3E87c88ce',
  '0xa542e3CDd21841CcBcCA70017101eb6a2fc68723',
  '0xa5EFf6157b44D7Eba6b003b72044BCB58FaBa036',
  '0xa71F3a167c13f41D41130BAD9ABE72b3dedc6f29',
  '0xaA8494f90C3025f361600c7dCb3255fE1F8DdB9C',
  '0xaC513396Ee50091972eE6fc07D120b6Ad360b233',
  '0xaEaaC358560e11f52454D997AAFF2c5731B6f8a6',
  '0xaaf710a008c60Ca60454FDa7384A5B11313f8CDc',
  '0xae1C0CCf078728520602338626cD1Ac4689764D0',
  '0xb1C8094B234DcE6e03f10a5b673c1d8C69739A00',
  '0xb31D2090633DDcfe4Ef676Cd2EB38D5D36163Ac7',
  '0xb541fc07bC7619fD4062A54d96268525cBC6FfEF',
  '0xb61C06EEF65e9aa59F371A77699C34FbEF477f0d',
  '0xb63D434fAFC6240e928928F27cDFCec90eba69d6',
  '0xb6B93E7E3E6619234a2c3280cC77fe752E7e792c',
  '0xb6e11377462dEae18556Dc69b7502cE41eB614C9',
  '0xbB93e510BbCD0B7beb5A853875f9eC60275CF498',
  '0xbcDB800D77ccAAc6597830b026d6af78A1118f42',
  '0xc0B654BEAD8d1a29776d9F80529F82CeD93df8f6',
  '0xc0EAB859481c28c2689395194D24997851A36eB4',
  '0xc29D1ee0E591b579cE1b6068f2A7906e90ae06E2',
  '0xc611952D81E4ECbd17c8f963123DeC5D7BCe1c27',
  '0xc9d21f523f577F0754a6D23243B7Bd2B46114092',
  '0xcBd00C9A86f3BfD4441693E0D23F5026A648117F',
  '0xcCF085dA594EAF1469e2BCdB4542c22B47929101',
  '0xd14224fa742f6a823EC43E1D7A9349F28a6876E4',
  '0xd45Ece50811082f6185A73b6A1D7C6EeF0e75e0F',
  '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b',
  '0xd96f2B1c14Db8458374d9Aca76E26c3D18364307',
  '0xdC8A9006a0E721500FcAaB5012ab7A1C036c23F7',
  '0xe4EEe5580b2e91130fA65b14d5E2aBc1bd250811',
  '0xe708f17240732bBfa1BaA8513F66b665Fbc7ce10',
  '0xeF5a3f2139F41Dd28FBE420f715dEB14d4E795f2',
  '0xebd9dc7FB828265E913b6060461222e9595D7Dc9',
  '0xef253B05430F396E65863a7F79A5b2875D8Aae94',
  '0xef967ECE5322c0D7d26Dab41778ACb55CE5Bd58B',
  '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
  '0xf36a53654a0BEC010a9797A2Feb35D2c7f75b384',
  '0xf41CCe45725DF4378e7a4387c337ee5EdA66F331',
  '0xf58921f742009c1e71Ac755203A34590fBE91301',
  '0xf85219B9bB810894020f2c19eA2952f3aaBf916e',
  '0xf8E9b412a1063Db62C8e724144908F544E5c1fee',
  '0xfB23eEeAEd7b2C39941a90f8a22D671A3375528b',
  '0xfc72c15Cd9B13e187b70bD2C0308E748dA615172',
  '0x3Cffd56B47B7b41c56258D9C7731ABaDc360E073',
  '0x53b6936513e738f44FB50d2b9476730C0Ab3Bfc1',
  '0x35fB6f6DB4fb05e6A4cE86f2C93691425626d4b1',
  '0xF7B31119c2682c88d88D455dBb9d5932c65Cf1bE',
  '0x3e37627dEAA754090fBFbb8bd226c1CE66D255e9',
  '0x08723392Ed15743cc38513C4925f5e6be5c17243',
  '0x7Db418b5D567A4e0E8c59Ad71BE1FcE48f3E6107',
  '0x72a5843cc08275C8171E582972Aa4fDa8C397B2A',
  '0x7F19720A857F834887FC9A7bC0a0fBe7Fc7f8102',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x1da5821544e25c636c1417Ba96Ade4Cf6D2f9B5A',
  '0x9F4cda013E354b8fC285BF4b9A60460cEe7f7Ea9',
  '0x19Aa5Fe80D33a56D56c78e82eA5E50E5d80b4Dff',
  '0x2f389cE8bD8ff92De3402FFCe4691d17fC4f6535',
  '0xe7aa314c77F4233C18C6CC84384A9247c0cf367B',
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C',
  '0x308eD4B7b49797e1A98D3818bFF6fe5385410370',
  '0x67d40EE1A85bf4a4Bb7Ffae16De985e8427B',
  '0x6f1ca141a28907f78ebaa64fb83a9088b02a83',
  '0x6acdfba02d390b97ac2b2d42a63e85293bcc1',
  '0x48549a34ae37b12f6a30566245176994e17c6',
  '0x5512d943ed1f7c8a43f3435c85f7ab68b30121',
  '0xC455f7fd3e0e12afd51fba5c106909934D8A0e4a',
  '0x3CBdeD43EFdAf0FC77b9C55F6fC9988fCC9b757d',
  '0x67d40EE1A85bf4a4Bb7Ffae16De985e8427B6b45',
  '0x6F1cA141A28907F78Ebaa64fb83A9088b02A8352',
  '0x6aCDFBA02D390b97Ac2b2d42A63E85293BCc160e',
  '0x48549a34ae37b12f6a30566245176994e17c6b4a',
  '0x5512d943ed1f7c8a43f3435c85f7ab68b30121b0',
  '0xfEC8A60023265364D066a1212fDE3930F6Ae8da7',
];

export default {
  BLACKLIST_ADDRESSES,
  isAddressBlacklisted,
};
