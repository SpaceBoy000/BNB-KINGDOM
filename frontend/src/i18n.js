import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          description: {
            title1: 'Kingdom Economy',
            title2: 'My Kingdom',
            
            subTitle1: 'Kingdom Statistics',
            des1: 'View Live BNB Kingdom Statistics',
            tvl: 'Total Value Locked',
            esRate: 'Estimated Rate',
            lands: 'Lands',
            dAPR: 'Daily APR',
            dAPR_b: 'The daily APR is the rate up to which you receive interest on your initial investment on the daily timeframe. This protocol features a uniquely interchangeable interest rate. Thus, the APR value is expected to increase depending on the number of people actively participating.',
            yAPR: 'Yearly APR',
            kTax: 'Kingdom’s Tax',
            kTax_b: 'The whole amount will be directly reinvested in the expansion of BNB Kingdom.',
            cot: 'Cut Off Point',
            hours: 'Hours',
            mndCpd: 'Mandatory Compound',
            mndCpd_b: 'Minimum number of times you have to compound in order to avoid the Early Withdraw Tax',
            times: 'Times',
            ewTax: 'Early Withdraw Tax',
            acm: 'Anti Corruption Mechanism',
            acm_b: 'This feature will prevent bots from accessing BNB Kingdom.',
            
            subTitle2: 'Profit Calculator',
            des2: 'Calculate Your Potential Profits',
            ii: 'Initial Investment',
            cd: 'Compounding Duration (Days)',
            calc: 'calculate',
            nTotal: 'New Total',
            pAmt: 'Profit Amount',
            pVal: 'Profit Value',

            subTitle3: 'Build Kingdom',
            des3: 'Expand Your Kingdom',
            lOwn: 'Lands Owned',
            lOwn_b: 'Your lands are responsible to create your rewards. Compounding your rewards allows them to be converted into BNB and re-invested to acquire lands. This will allow you to expand your kingdom at a faster rate. Selling your rewards will give you the converted BNB amount.',
            lVal: 'Lands Value',
            lVal_b: 'This is the value of your lands in BNB using the Estimated Rated of Land/BNB.',
            daEsRwd: 'Daily Estimated Rewards',
            rwdBal: 'Reward Balance',
            noRwdDct: 'No Reward Detected',
            cpdCnt: 'Compound Counter',
            noCpdDct: 'No Compound Detected',
            wBal: 'Wallet Balance',
            esY: 'Estimated Yield',
            buyLands: 'buy Lands',
            cpdRwds: 'Compound Rewards',
            clmRwd: 'Claim Rewards',

            subTitle4: 'Configure Referrer',
            des4: 'Configure Your Referrer',
            yoRefLink: 'Your Referral Link',
            yoRefLink_b: 'Earn 12% of the BNB used to buy Lands from anyone who uses your referral link.',
            cpylink: 'copy the referral link',
            refBonus: 'Total Referral Bonus Gained',
            noBonusDct: 'No Bonus Detected',
          }
        }
      },

      fr: {
        translation: {
          description: {
            title1: 'Économie du Royaume',
            title2: 'Mon royaume',

            subTitle1: 'Statistiques du Royaume',
            des1: 'Afficher les statistiques en direct de BNB Kingdom',
            tvl: 'Liquidité totale verrouillée',
            esRate: 'Taux estimé',
            lands: 'Lands',
            dAPR: 'APR quotidien',
            dAPR_b: "L'APR quotidien est le taux auquel vous recevez des intérêts sur votre investissement initial sur la période quotidienne. Ce protocole comporte un taux d'intérêt interchangeable unique. Ainsi, la valeur APR devrait augmenter en fonction du nombre de personnes participant activement.",
            yAPR: 'APR annuel',
            kTax: 'Taxe du Royaume',
            kTax_b: "Le montant total sera directement réinvesti dans l'expansion de BNB Kingdom.",
            cot: 'Point de coupure',
            hours: 'Heures',
            mndCpd: 'Composé obligatoire',
            mndCpd_b: "Nombre minimum de fois que vous devez composer afin d'éviter l'impôt sur les retraits anticipés.",
            times: 'Fois',
            ewTax: 'Taxe de retrait anticipé',
            acm: 'Mécanisme anti-corruption',
            acm_b: "Cette fonctionnalité empêchera les bots d'accéder à BNB Kingdom.",
            
            subTitle2: 'Calculateur de bénéfices',
            des2: 'Calculez vos bénéfices potentiels',
            ii: 'Investissement initial',
            cd: 'Durée de capitalisation (Jours)',
            calc: 'calculer',
            nTotal: 'Nouveau total',
            pAmt: 'Montant du bénéfice',
            pVal: 'Valeur du bénéfice',
            
            subTitle3: 'Construire un royaume',
            des3: 'Développez votre royaume',
            lOwn: 'Lands possédées',
            lOwn_b: "Vos Lands sont chargées de créer vos récompenses. La composition de vos récompenses permet de les convertir en BNB et de les réinvestir pour acquérir des ands. Cela vous permettra d'étendre votre royaume à un rythme plus rapide. La vente de vos récompenses vous donnera le montant converti en BNB.",
            lVal: 'Valeur des Lands',
            lVal_b: "Il s'agit de la valeur de vos Lands en BNB en utilisant la valeur estimée du Land/BNB.",
            daEsRwd: 'Récompenses quotidiennes estimées',
            rwdBal: 'Solde des récompenses',
            noRwdDct: 'Aucune récompense détectée',
            cpdCnt: 'Compteur composé',
            noCpdDct: 'Aucun composé détecté',
            wBal: 'Solde du portefeuille',
            esY: 'Rendement estimé',
            buyLands: 'acheter des Lands',
            cpdRwds: 'RÉINVESTIR LES RÉCOMPENSES',
            clmRwd: 'RÉCLAMER LES RÉCOMPENSES',

            subTitle4: 'Configurer le parrainage',
            des4: 'Configurez votre référent',
            yoRefLink: 'Votre lien de parrainage',
            yoRefLink_b: "Gagnez 12% du BNB utilisé pour acheter des Lands à toute personne qui utilise votre lien de parrainage.",
            cpylink: 'copier le lien de parrainage',
            refBonus: 'Bonus de parrainage total gagné',
            noBonusDct: 'Aucun bonus détecté',
          }
        }
      },

      ch: {
        translation: {
          description: {
            title1: '王国经济',
            title2: '我的王国',
            
            subTitle1: '王国统计',
            des1: '查看实时 BNB 王国统计数据',
            tvl: '总价值锁定',
            esRate: '估计费率',
            lands: '土地',
            dAPR: '每日四月',
            dAPR_b: "每日 APR 是您在每日时间范围内获得初始投资利息的最高利率。 该协议具有独特的可互换利率。 因此，预计 APR 值会根据积极参与的人数而增加。",
            yAPR: '每年四月',
            kTax: '王国的税收',
            kTax_b: "全部金额将直接再投资于BNB王国的扩张。",
            cot: '截止点',
            hours: '小时',
            mndCpd: '强制化合物',
            mndCpd_b: "为了避免提前提款税，您必须复利的最少次数",
            times: '时代',
            ewTax: '提早退税',
            acm: '反贪机制',
            acm_b: '此功能将阻止机器人访问 BNB Kingdom。',
            
            subTitle2: '利润计算器',
            des2: '计算您的潜在利润',
            ii: '初始投资',
            cd: '复利时间（天）',
            calc: '计算',
            nTotal: '新总计',
            pAmt: '利润金额',
            pVal: '利润价值',

            subTitle3: '建立王国',
            des3: '扩展你的王国',
            lOwn: '拥有的土地',
            lOwn_b: "你的土地负责创造你的奖励。 复合您的奖励可以将它们转换为 BNB 并重新投资以获取土地。 这将使您能够以更快的速度扩展您的王国。 出售您的奖励将为您提供转换后的 BNB 金额。",
            lVal: '土地价值',
            lVal_b: "这是您的土地在 BNB 中的价值，使用估计的土地/BNB 评级。",
            daEsRwd: '每日预计奖励',
            rwdBal: '奖励余额',
            noRwdDct: '未检测到奖励',
            cpdCnt: '复合计数器',
            noCpdDct: '未检测到化合物',
            wBal: '钱包余额',
            esY: '预计产量',
            buyLands: '购买土地',
            cpdRwds: '复合奖励',
            clmRwd: '领取奖励',

            subTitle4: '配置推荐人',
            des4: '配置您的推荐人',
            yoRefLink: '您的推荐链接',
            yoRefLink_b: "从使用您的推荐链接的任何人那里获得用于购买土地的 BNB 的 12%。",
            cpylink: '复制推荐链接',
            refBonus: '获得的总推荐奖金',
            noBonusDct: '未检测到奖金',
          }
        }
      },

      sp: {
        translation: {
          description: {
            title1: 'Economía del Reino',
            title2: 'Mi reino',
            
            subTitle1: 'Estadísticas del Reino',
            des1: 'Ver estadísticas del Reino BNB en vivo',
            tvl: 'Valor total bloqueado',
            esRate: 'Tarifa estimada',
            lands: 'Tierras',
            dAPR: 'Diario APR',
            dAPR_b: 'La APR diaria es la tasa hasta la cual recibe intereses sobre su inversión inicial en el marco de tiempo diario. Este protocolo presenta una tasa de interés intercambiable única. Por lo tanto, se espera que el valor APR aumente dependiendo del número de personas que participen activamente.',
            yAPR: 'Anual APR',
            kTax: 'Impuesto del Reino',
            kTax_b: 'La cantidad total se reinvertirá directamente en la expansión de BNB Kingdom.',
            cot: 'Punto de corte',
            hours: 'Horas',
            mndCpd: 'Compuesto Obligatorio',
            mndCpd_b: 'Número mínimo de veces que tiene que capitalizar para evitar el impuesto de retiro anticipado',
            times: 'Tiempos',
            ewTax: 'Impuesto de Retiro Anticipado',
            acm: 'Mecanismo Anticorrupción',
            acm_b: 'Esta función evitará que los bots accedan a BNB Kingdom.',
            
            subTitle2: 'Calculadora de ganancias',
            des2: 'Calcule sus ganancias potenciales',
            ii: 'Inversión Inicial',
            cd: 'Duración de capitalización (días)',
            calc: 'calcular',
            nTotal: 'Nuevo Total',
            pAmt: 'Cantidad de beneficio',
            pVal: 'Valor de beneficio',

            subTitle3: 'Construir Reino',
            des3: 'Expande tu Reino',
            lOwn: 'Tierras propias',
            lOwn_b: 'Tus tierras son responsables de crear tus recompensas. La combinación de sus recompensas les permite convertirse en BNB y reinvertirse para adquirir tierras. Esto te permitirá expandir tu reino a un ritmo más rápido. Vender sus recompensas le dará la cantidad BNB convertida.',
            lVal: 'Valor de la tierra',
            lVal_b: 'Este es el valor de sus terrenos en BNB usando la Tasación Estimada de Terreno/BNB.',
            daEsRwd: 'Recompensas diarias estimadas',
            rwdBal: 'Saldo de recompensas',
            noRwdDct: 'No se detectó ninguna recompensa',
            cpdCnt: 'Contador compuesto',
            noCpdDct: 'No se detectó ningún compuesto',
            wBal: 'Saldo de la cartera',
            esY: 'Rendimiento estimado',
            buyLands: 'comprar Tierras',
            cpdRwds: 'Recompensas compuestas',
            clmRwd: 'Reclamar recompensas',

            subTitle4: 'Configurar Referente',
            des4: 'Configura tu referente',
            yoRefLink: 'Tu enlace de referencia',
            yoRefLink_b: 'Gana el 12% del BNB usado para comprar Lands de cualquier persona que use tu enlace de referencia.',
            cpylink: 'copiar el enlace de referencia',
            refBonus: 'Total de bonificación de recomendación obtenida',
            noBonusDct: 'No se detectó ningún bono',
          }
        }
      },
    }
  });

export default i18n;