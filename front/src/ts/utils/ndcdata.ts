export type NdcData = NdcPrimaryItem[];

export type NdcPrimaryItem = {
  key: string;
  title: string;
  titleEn: string;
  children: NdcSecondaryItem[];
};

export type NdcSecondaryItem = {
  title: string;
  titleEn: string;
  key: string;
  children: NdcTertiaryItem[];
};

export type NdcTertiaryItem = {
  title: string;
  titleEn: string;
  key: string;
};

export const ndcData: NdcData = [
  {
    key: "000",
    title: "総記",
    children: [
      {
        key: "000",
        title: "総記",
        children: [
          {
            key: "002",
            title: "知識．学問．学術",
            titleEn: "Knowledge. Learning",
          },
          { key: "007", title: "情報科学", titleEn: "Information science" },
        ],
        titleEn: "General works",
      },
      {
        key: "010",
        title: "図書館．図書館学",
        children: [
          {
            key: "011",
            title: "図書館政策．図書館行財政",
            titleEn: "Library policy and administration",
          },
          {
            key: "012",
            title: "図書館建築．図書館設備",
            titleEn: "Library buildings",
          },
          { key: "013", title: "図書館管理", titleEn: "Library management" },
          {
            key: "014",
            title: "資料の収集．資料の整理．資料の保管",
            titleEn: "Technical processes in libraries",
          },
          {
            key: "015",
            title: "図書館奉仕．図書館活動",
            titleEn: "Library activities",
          },
          {
            key: "016",
            title: "各種の図書館",
            titleEn: "Specific kinds of institutions",
          },
          { key: "017", title: "学校図書館", titleEn: "School libraries" },
          { key: "018", title: "専門図書館", titleEn: "Special libraries" },
          {
            key: "019",
            title: "読書．読書法",
            titleEn: "Reading of books. Book review",
          },
        ],
        titleEn: "Libraries. Library and information sciences",
      },
      {
        key: "020",
        title: "図書．書誌学",
        children: [
          {
            key: "021",
            title: "著作．編集",
            titleEn: "Authorship and editorial techniques",
          },
          {
            key: "022",
            title: "写本．刊本．造本",
            titleEn: "Manuscripts and printed books",
          },
          { key: "023", title: "出版", titleEn: "Publishing" },
          { key: "024", title: "図書の販売", titleEn: "Bookselling" },
          {
            key: "025",
            title: "一般書誌．全国書誌",
            titleEn: "General and national bibliographies",
          },
          {
            key: "026",
            title: "稀書目録．善本目録",
            titleEn: "Bibliographies of rare books",
          },
          { key: "027", title: "特種目録", titleEn: "Special bibliographies" },
          {
            key: "028",
            title: "選定図書目録．参考図書目録",
            titleEn: "Catalogs of selected books. Catalogs of reference books",
          },
          {
            key: "029",
            title: "蔵書目録．総合目録",
            titleEn: "Library catalogs. Union catalogs",
          },
        ],
        titleEn: "Books. Bibliography",
      },
      {
        key: "030",
        title: "百科事典",
        children: [
          { key: "031", title: "日本語", titleEn: "Nipponese" },
          { key: "032", title: "中国語", titleEn: "Chinese" },
          { key: "033", title: "英語", titleEn: "English" },
          { key: "034", title: "ドイツ語", titleEn: "German" },
          { key: "035", title: "フランス語", titleEn: "French" },
          { key: "036", title: "スペイン語", titleEn: "Spanish" },
          { key: "037", title: "イタリア語", titleEn: "Italian" },
          { key: "038", title: "ロシア語", titleEn: "Russian" },
          {
            key: "039",
            title: "用語索引＜一般＞",
            titleEn: "General concordances",
          },
        ],
        titleEn: "General encyclopedias",
      },
      {
        key: "040",
        title: "一般論文集．一般講演集",
        children: [
          { key: "041", title: "日本語", titleEn: "Nipponese" },
          { key: "042", title: "中国語", titleEn: "Chinese" },
          { key: "043", title: "英語", titleEn: "English" },
          { key: "044", title: "ドイツ語", titleEn: "German" },
          { key: "045", title: "フランス語", titleEn: "French" },
          { key: "046", title: "スペイン語", titleEn: "Spanish" },
          { key: "047", title: "イタリア語", titleEn: "Italian" },
          { key: "048", title: "ロシア語", titleEn: "Russian" },
          { key: "049", title: "雑著", titleEn: "General miscellanies" },
        ],
        titleEn: "General collected essays",
      },
      {
        key: "050",
        title: "逐次刊行物",
        children: [
          {
            key: "051",
            title: "日本の雑誌",
            titleEn: "Nipponese serial publications",
          },
          {
            key: "052",
            title: "中国語",
            titleEn: "Chinese serial publications",
          },
          { key: "053", title: "英語", titleEn: "English serial publications" },
          {
            key: "054",
            title: "ドイツ語",
            titleEn: "German serial publications",
          },
          {
            key: "055",
            title: "フランス語",
            titleEn: "French serial publications",
          },
          {
            key: "056",
            title: "スペイン語",
            titleEn: "Spanish serial publications",
          },
          {
            key: "057",
            title: "イタリア語",
            titleEn: "Italian serial publications",
          },
          {
            key: "058",
            title: "ロシア語",
            titleEn: "Russian serial publications",
          },
          { key: "059", title: "一般年鑑", titleEn: "General yearbooks" },
        ],
        titleEn: "General serial publications",
      },
      {
        key: "060",
        title: "団体：学会，協会，会議",
        children: [
          { key: "061", title: "学術・研究機関", titleEn: "Academies" },
          {
            key: "063",
            title: "文化交流機関",
            titleEn: "Cultural exchange organizations",
          },
          {
            key: "065",
            title: "親睦団体．その他の団体",
            titleEn: "Service clubs and other societies",
          },
          { key: "069", title: "博物館", titleEn: "Museums" },
        ],
        titleEn: "General societies",
      },
      {
        key: "070",
        title: "ジャーナリズム．新聞",
        children: [
          { key: "071", title: "日本", titleEn: "Nippon" },
          { key: "072", title: "アジア", titleEn: "Asia" },
          { key: "073", title: "ヨーロッパ", titleEn: "Europe" },
          { key: "074", title: "アフリカ", titleEn: "Africa" },
          { key: "075", title: "北アメリカ", titleEn: "North America" },
          { key: "076", title: "南アメリカ", titleEn: "South America" },
          {
            key: "077",
            title: "オセアニア．両極地方",
            titleEn: "Oceania. Polar regions",
          },
        ],
        titleEn: "Journalism. Newspapers",
      },
      {
        key: "080",
        title: "叢書．全集．選集",
        children: [
          { key: "081", title: "日本語", titleEn: "Nipponese" },
          { key: "082", title: "中国語", titleEn: "Chinese" },
          { key: "083", title: "英語", titleEn: "English" },
          { key: "084", title: "ドイツ語", titleEn: "German" },
          { key: "085", title: "フランス語", titleEn: "French" },
          { key: "086", title: "スペイン語", titleEn: "Spanish" },
          { key: "087", title: "イタリア語", titleEn: "Italian" },
          { key: "088", title: "ロシア語", titleEn: "Russian" },
          { key: "089", title: "その他の諸言語", titleEn: "Other languages" },
        ],
        titleEn: "General collections",
      },
      {
        key: "090",
        title: "貴重書．郷土資料．その他の特別コレクション",
        children: [],
        titleEn: "Rare books. Local collections. Special collections",
      },
    ],
    titleEn: "General works",
  },
  {
    key: "100",
    title: "哲学",
    children: [
      {
        key: "100",
        title: "哲学",
        children: [
          { key: "101", title: "哲学理論", titleEn: "Theory of philosophy" },
          {
            key: "102",
            title: "哲学史",
            titleEn: "General history of philosophy",
          },
          {
            key: "103",
            title: "参考図書［レファレンス ブック］",
            titleEn: "Reference books",
          },
          {
            key: "104",
            title: "論文集．評論集．講演集",
            titleEn: "Essays and lectures",
          },
          { key: "105", title: "逐次刊行物", titleEn: "Serial publications" },
          {
            key: "106",
            title: "団体：学会，協会，会議",
            titleEn: "Organizations",
          },
          {
            key: "107",
            title: "研究法．指導法．哲学教育",
            titleEn: "Study and teaching",
          },
          {
            key: "108",
            title: "叢書．全集．選集",
            titleEn: "Collected works. Collections",
          },
        ],
        titleEn: "Philosophy",
      },
      {
        key: "110",
        title: "哲学各論",
        children: [
          {
            key: "111",
            title: "形而上学．存在論",
            titleEn: "Metaphysics. Ontology",
          },
          {
            key: "112",
            title: "自然哲学．宇宙論",
            titleEn: "Philosophy of nature. Cosmology",
          },
          {
            key: "113",
            title: "人生観．世界観",
            titleEn: "View of life. World view",
          },
          { key: "114", title: "人間学", titleEn: "Philosophic anthropology" },
          { key: "115", title: "認識論", titleEn: "Epistemology" },
          {
            key: "116",
            title: "論理学．弁証法［弁証法的論理学］．方法論",
            titleEn: "Logics. Dialectics. Methodology",
          },
          { key: "117", title: "価値哲学", titleEn: "Philosophy of value" },
          {
            key: "118",
            title: "文化哲学．技術哲学",
            titleEn: "Philosophy of culture and technics",
          },
          { key: "119", title: "美学", titleEn: "Aesthetics" },
        ],
        titleEn: "Special treatises on philosophy",
      },
      {
        key: "120",
        title: "東洋思想",
        children: [
          { key: "121", title: "日本思想", titleEn: "Nipponese thought" },
          {
            key: "122",
            title: "中国思想．中国哲学",
            titleEn: "Chinese thought",
          },
          { key: "123", title: "経書", titleEn: "Chinese classics" },
          {
            key: "124",
            title: "先秦思想．諸子百家",
            titleEn: "Sages of Pre-Chin",
          },
          {
            key: "125",
            title: "中世思想．近代思想",
            titleEn: "Medieval and modern thought",
          },
          {
            key: "126",
            title: "インド哲学．バラモン教",
            titleEn: "Indian philosophy. Brahmanism",
          },
          {
            key: "129",
            title: "その他のアジア・アラブ哲学",
            titleEn: "Other Oriental and Arabic thought",
          },
        ],
        titleEn: "Oriental thought",
      },
      {
        key: "130",
        title: "西洋哲学",
        children: [
          { key: "131", title: "古代哲学", titleEn: "Ancient philosophy" },
          { key: "132", title: "中世哲学", titleEn: "Medieval philosophy" },
          { key: "133", title: "近代哲学", titleEn: "Modern philosophy" },
          {
            key: "134",
            title: "ドイツ・オーストリア哲学",
            titleEn: "German and Austrian philosophy",
          },
          {
            key: "135",
            title: "フランス・オランダ哲学",
            titleEn: "French and Dutch philosophy",
          },
          {
            key: "136",
            title: "スペイン・ポルトガル哲学",
            titleEn: "Spanish and Portuguese philosophy",
          },
          { key: "137", title: "イタリア哲学", titleEn: "Italian philosophy" },
          { key: "138", title: "ロシア哲学", titleEn: "Russian philosophy" },
          { key: "139", title: "その他の哲学", titleEn: "Other philosophy" },
        ],
        titleEn: "Western philosophy",
      },
      {
        key: "140",
        title: "心理学",
        children: [
          {
            key: "141",
            title: "普通心理学．心理各論",
            titleEn: "General psychology",
          },
          {
            key: "143",
            title: "発達心理学",
            titleEn: "Developmental psychology",
          },
          { key: "145", title: "異常心理学", titleEn: "Abnormal psychology" },
          {
            key: "146",
            title: "臨床心理学．精神分析学",
            titleEn: "Clinical psychology. Psychoanalysis",
          },
          {
            key: "147",
            title: "超心理学．心霊研究",
            titleEn: "Parapsychology",
          },
          { key: "148", title: "相法．易占", titleEn: "Divination" },
          { key: "149", title: "応用心理学", titleEn: "Applied psychology" },
        ],
        titleEn: "Psychology",
      },
      {
        key: "150",
        title: "倫理学．道徳",
        children: [
          { key: "151", title: "倫理各論", titleEn: "Systems and doctrines" },
          {
            key: "152",
            title: "家庭倫理．性倫理",
            titleEn: "Family and sexual ethics",
          },
          {
            key: "153",
            title: "職業倫理",
            titleEn: "Professional and occupational ethics",
          },
          {
            key: "154",
            title: "社会倫理［社会道徳］",
            titleEn: "Social ethics",
          },
          { key: "155", title: "国体論．詔勅", titleEn: "National polity" },
          { key: "156", title: "武士道", titleEn: "Bushidô" },
          {
            key: "157",
            title: "報徳教．石門心学",
            titleEn: "Hôtokukyô. Shingaku",
          },
          {
            key: "158",
            title: "その他の特定主題",
            titleEn: "Other ethical topics",
          },
          { key: "159", title: "人生訓．教訓", titleEn: "Practical ethics" },
        ],
        titleEn: "Ethics. Morals",
      },
      {
        key: "160",
        title: "宗教",
        children: [
          {
            key: "161",
            title: "宗教学．宗教思想",
            titleEn: "Science of religion",
          },
          {
            key: "162",
            title: "宗教史・事情",
            titleEn: "History and conditions of religions",
          },
          {
            key: "163",
            title: "原始宗教．宗教民族学",
            titleEn: "Primitive religions",
          },
          { key: "164", title: "神話．神話学", titleEn: "Myths. Mythology" },
          { key: "165", title: "比較宗教", titleEn: "Comparative religion" },
          { key: "166", title: "道教", titleEn: "Taoism" },
          { key: "167", title: "イスラム", titleEn: "Islam" },
          {
            key: "168",
            title: "ヒンズー教．ジャイナ教",
            titleEn: "Hinduism. Jainism",
          },
          {
            key: "169",
            title: "その他の宗教．新興宗教",
            titleEn: "Other religions",
          },
        ],
        titleEn: "Religion",
      },
      {
        key: "170",
        title: "神道",
        children: [
          { key: "171", title: "神道思想．神道説", titleEn: "Shintô theology" },
          {
            key: "172",
            title: "神祇・神道史",
            titleEn: "History and conditions of Shintô",
          },
          { key: "173", title: "神典", titleEn: "Shintô sacred classics" },
          {
            key: "174",
            title: "信仰録．説教集",
            titleEn: "Priestly memoirs. Sermons",
          },
          {
            key: "175",
            title: "神社．神職",
            titleEn: "Shrines. Shintô priests",
          },
          { key: "176", title: "祭祀", titleEn: "Shintô festivals" },
          { key: "177", title: "布教．伝道", titleEn: "Shintô missions" },
          {
            key: "178",
            title: "各教派．教派神道",
            titleEn: "Sectarian Shintô",
          },
        ],
        titleEn: "Shintô",
      },
      {
        key: "180",
        title: "仏教",
        children: [
          {
            key: "181",
            title: "仏教教理．仏教哲学",
            titleEn: "Buddhist doctrines",
          },
          {
            key: "182",
            title: "仏教史",
            titleEn: "History and conditions of Buddhism",
          },
          { key: "183", title: "経典", titleEn: "Buddhist scriptures" },
          { key: "184", title: "法話・説教集", titleEn: "Sermons. Preaching" },
          {
            key: "185",
            title: "寺院．僧職",
            titleEn: "Temples. Buddhist priests",
          },
          {
            key: "186",
            title: "仏会",
            titleEn: "Buddhist services and customs",
          },
          { key: "187", title: "布教．伝道", titleEn: "Buddhist missions" },
          { key: "188", title: "各宗", titleEn: "Buddhist sects" },
        ],
        titleEn: "Buddhism",
      },
      {
        key: "190",
        title: "キリスト教",
        children: [
          {
            key: "191",
            title: "教義．キリスト教神学",
            titleEn: "Christian theology",
          },
          {
            key: "192",
            title: "キリスト教史．迫害史",
            titleEn: "History and conditions of Christianity",
          },
          { key: "193", title: "聖書", titleEn: "Bible" },
          {
            key: "194",
            title: "信仰録．説教集",
            titleEn: "Priestly memoirs. Sermons",
          },
          {
            key: "195",
            title: "教会．聖職",
            titleEn: "Christian church. Holy orders",
          },
          {
            key: "196",
            title: "典礼．祭式．礼拝",
            titleEn: "Ritual and liturgy",
          },
          { key: "197", title: "布教．伝道", titleEn: "Missions" },
          {
            key: "198",
            title: "各教派．教会史",
            titleEn: "Denominations of Christian churches",
          },
          { key: "199", title: "ユダヤ教", titleEn: "Judaism" },
        ],
        titleEn: "Christianity",
      },
    ],
    titleEn: "Philosophy",
  },
  {
    key: "200",
    title: "歴史",
    children: [
      {
        key: "200",
        title: "歴史",
        children: [
          { key: "201", title: "歴史学", titleEn: "Historical science" },
          {
            key: "202",
            title: "歴史補助学",
            titleEn: "Auxiliary sciences of history",
          },
          {
            key: "203",
            title: "参考図書［レファレンス ブック］",
            titleEn: "Reference books",
          },
          {
            key: "204",
            title: "論文集．評論集．講演集",
            titleEn: "Essays and lectures",
          },
          { key: "205", title: "逐次刊行物", titleEn: "Serial publications" },
          {
            key: "206",
            title: "団体：学会，協会，会議",
            titleEn: "Organizations",
          },
          {
            key: "207",
            title: "研究法．指導法．歴史教育",
            titleEn: "Study and teaching",
          },
          {
            key: "208",
            title: "叢書．全集．選集",
            titleEn: "Collected works. Collections",
          },
          { key: "209", title: "世界史．文化史", titleEn: "World history" },
        ],
        titleEn: "General history",
      },
      {
        key: "210",
        title: "日本史",
        children: [
          { key: "211", title: "北海道地方", titleEn: "Hokkaidô" },
          { key: "212", title: "東北地方", titleEn: "Tôhoku" },
          { key: "213", title: "関東地方", titleEn: "Kantô" },
          { key: "214", title: "北陸地方", titleEn: "Hokuriku" },
          { key: "215", title: "中部地方：東山・東海地方", titleEn: "Chûbu" },
          { key: "216", title: "近畿地方", titleEn: "Kinki" },
          { key: "217", title: "中国地方", titleEn: "Chûgoku" },
          { key: "218", title: "四国地方", titleEn: "Shikoku" },
          { key: "219", title: "九州地方", titleEn: "Kyûshû" },
        ],
        titleEn: "General history of Nippon",
      },
      {
        key: "220",
        title: "アジア史．東洋史",
        children: [
          { key: "221", title: "朝鮮", titleEn: "Korea" },
          { key: "222", title: "中国", titleEn: "China" },
          { key: "223", title: "東南アジア", titleEn: "Southeast Asia" },
          { key: "224", title: "インドネシア", titleEn: "Indonesia" },
          { key: "225", title: "インド", titleEn: "India" },
          {
            key: "226",
            title: "西南アジア．中東［近東］",
            titleEn: "Southwest Asia. Middle East",
          },
          {
            key: "227",
            title: "西南アジア．中東［近東］",
            titleEn: "Southwest Asia. Middle East",
          },
          { key: "228", title: "アラブ諸国", titleEn: "Arab states" },
          { key: "229", title: "アジア・ロシア", titleEn: "Asiatic Russia" },
        ],
        titleEn: "General history of Asia",
      },
      {
        key: "230",
        title: "ヨーロッパ史．西洋史",
        children: [
          { key: "231", title: "古代ギリシア", titleEn: "Ancient Greece" },
          { key: "232", title: "古代ローマ", titleEn: "Ancient Rome" },
          { key: "233", title: "イギリス．英国", titleEn: "United Kingdom" },
          {
            key: "234",
            title: "ドイツ．中欧",
            titleEn: "Germany. Central Europe",
          },
          { key: "235", title: "フランス", titleEn: "France" },
          { key: "236", title: "スペイン［イスパニア］", titleEn: "Spain" },
          { key: "237", title: "イタリア", titleEn: "Italy" },
          {
            key: "238",
            title: "ロシア［ソビエト連邦．独立国家共同体］",
            titleEn: "Russia. USSR. CIS",
          },
          { key: "239", title: "バルカン諸国", titleEn: "Balkan States" },
        ],
        titleEn: "General history of Europe",
      },
      {
        key: "240",
        title: "アフリカ史",
        children: [
          { key: "241", title: "北アフリカ", titleEn: "North Africa" },
          { key: "242", title: "エジプト", titleEn: "Egypt" },
          { key: "243", title: "バーバリ諸国", titleEn: "Barbary States" },
          { key: "244", title: "西アフリカ", titleEn: "West Africa" },
          { key: "245", title: "東アフリカ", titleEn: "East Africa" },
          { key: "248", title: "南アフリカ", titleEn: "South Africa" },
          {
            key: "249",
            title: "インド洋のアフリカ諸島",
            titleEn: "Islands of Indian Ocean",
          },
        ],
        titleEn: "General history of Africa",
      },
      {
        key: "250",
        title: "北アメリカ史",
        children: [
          { key: "251", title: "カナダ", titleEn: "Canada" },
          {
            key: "253",
            title: "アメリカ合衆国",
            titleEn: "United States of America",
          },
          {
            key: "255",
            title: "ラテン・アメリカ［中南米］",
            titleEn: "Latin America",
          },
          { key: "256", title: "メキシコ", titleEn: "Mexico" },
          {
            key: "257",
            title: "中央アメリカ［中米諸国］",
            titleEn: "Central America",
          },
          {
            key: "259",
            title: "西インド諸島",
            titleEn: "West Indies. Antilles",
          },
        ],
        titleEn: "General history of North America",
      },
      {
        key: "260",
        title: "南アメリカ史",
        children: [
          {
            key: "261",
            title: "北部諸国［カリブ沿海諸国］",
            titleEn: "Northern South America",
          },
          { key: "262", title: "ブラジル", titleEn: "Brazil" },
          { key: "263", title: "パラグアイ", titleEn: "Paraguay" },
          { key: "264", title: "ウルグアイ", titleEn: "Uruguay" },
          { key: "265", title: "アルゼンチン", titleEn: "Argentina" },
          { key: "266", title: "チリ", titleEn: "Chile" },
          { key: "267", title: "ボリビア", titleEn: "Bolivia" },
          { key: "268", title: "ペルー", titleEn: "Peru" },
        ],
        titleEn: "General history of South America",
      },
      {
        key: "270",
        title: "オセアニア史．両極地方史",
        children: [
          { key: "271", title: "オーストラリア", titleEn: "Australia" },
          { key: "272", title: "ニュージーランド", titleEn: "New Zealand" },
          { key: "273", title: "メラネシア", titleEn: "Melanesia" },
          { key: "274", title: "ミクロネシア", titleEn: "Micronesia" },
          { key: "275", title: "ポリネシア", titleEn: "Polynesia" },
          { key: "276", title: "ハワイ", titleEn: "Hawaii" },
          { key: "277", title: "両極地方", titleEn: "Polar regions" },
          {
            key: "278",
            title: "北極．北極地方",
            titleEn: "North pole. Arctic regions",
          },
          {
            key: "279",
            title: "南極．南極地方",
            titleEn: "South pole. Antarctic regions",
          },
        ],
        titleEn: "General history of Oceania. General history of Polar regions",
      },
      {
        key: "280",
        title: "伝記",
        children: [
          { key: "281", title: "日本", titleEn: "Nippon" },
          { key: "282", title: "アジア", titleEn: "Asia" },
          { key: "283", title: "ヨーロッパ", titleEn: "Europe" },
          { key: "284", title: "アフリカ", titleEn: "Africa" },
          { key: "285", title: "北アメリカ", titleEn: "North America" },
          { key: "286", title: "南アメリカ", titleEn: "South America" },
          {
            key: "287",
            title: "オセアニア．両極地方",
            titleEn: "Oceania. Polar regions",
          },
          {
            key: "288",
            title: "系譜．家史．皇室",
            titleEn: "Genealogy. Family history",
          },
          { key: "289", title: "個人伝記", titleEn: "Individual biography" },
        ],
        titleEn: "General biography",
      },
      {
        key: "290",
        title: "地理．地誌．紀行",
        children: [
          { key: "291", title: "日本", titleEn: "Nippon" },
          { key: "292", title: "アジア", titleEn: "Asia" },
          { key: "293", title: "ヨーロッパ", titleEn: "Europe" },
          { key: "294", title: "アフリカ", titleEn: "Africa" },
          { key: "295", title: "北アメリカ", titleEn: "North America" },
          { key: "296", title: "南アメリカ", titleEn: "South America" },
          {
            key: "297",
            title: "オセアニア．両極地方",
            titleEn: "Oceania. Polar regions",
          },
          { key: "299", title: "海洋", titleEn: "Oceans. Sea" },
        ],
        titleEn: "General geography. Description and travel",
      },
    ],
    titleEn: "General history",
  },
  {
    key: "300",
    title: "社会科学",
    children: [
      {
        key: "300",
        title: "社会科学",
        children: [
          {
            key: "301",
            title: "理論．方法論",
            titleEn: "Theory and methodology",
          },
          {
            key: "302",
            title: "政治・経済・社会・文化事情",
            titleEn: "Social situation and conditions",
          },
          {
            key: "303",
            title: "参考図書［レファレンス ブック］",
            titleEn: "Reference books",
          },
          {
            key: "304",
            title: "論文集．評論集．講演集",
            titleEn: "Essays and lectures",
          },
          { key: "305", title: "逐次刊行物", titleEn: "Serial publications" },
          {
            key: "306",
            title: "団体：学会，協会，会議",
            titleEn: "Organizations",
          },
          {
            key: "307",
            title: "研究法．指導法．社会科学教育",
            titleEn: "Study and teaching",
          },
          {
            key: "308",
            title: "叢書．全集．選集",
            titleEn: "Series. Collected works. Collections",
          },
          { key: "309", title: "社会思想", titleEn: "Social thought" },
        ],
        titleEn: "Social sciences",
      },
      {
        key: "310",
        title: "政治",
        children: [
          {
            key: "311",
            title: "政治学．政治思想",
            titleEn: "Political theory and thought",
          },
          {
            key: "312",
            title: "政治史・事情",
            titleEn: "Political history and conditions",
          },
          {
            key: "313",
            title: "国家の形態．政治体制",
            titleEn: "Forms of states. Political systems",
          },
          { key: "314", title: "議会", titleEn: "Legislature. Parliaments" },
          { key: "315", title: "政党．政治結社", titleEn: "Political parties" },
          {
            key: "316",
            title: "国家と個人・宗教・民族",
            titleEn: "State and individuals",
          },
          { key: "317", title: "行政", titleEn: "Public administration" },
          {
            key: "318",
            title: "地方自治．地方行政",
            titleEn: "Local governments. Local administration",
          },
          {
            key: "319",
            title: "外交．国際問題",
            titleEn: "International relations",
          },
        ],
        titleEn: "Political science",
      },
      {
        key: "320",
        title: "法律",
        children: [
          { key: "321", title: "法学", titleEn: "Jurisprudence" },
          { key: "322", title: "法制史", titleEn: "Legal history" },
          { key: "323", title: "憲法", titleEn: "Constitutional law" },
          { key: "324", title: "民法", titleEn: "Civil law" },
          { key: "325", title: "商法", titleEn: "Commercial law" },
          { key: "326", title: "刑法．刑事法", titleEn: "Criminal law" },
          {
            key: "327",
            title: "司法．訴訟手続法",
            titleEn: "Judicial system and proceedings",
          },
          { key: "328", title: "諸法", titleEn: "Special law" },
          { key: "329", title: "国際法", titleEn: "International law" },
        ],
        titleEn: "Law",
      },
      {
        key: "330",
        title: "経済",
        children: [
          {
            key: "331",
            title: "経済学．経済思想",
            titleEn: "Economic theory and thought",
          },
          {
            key: "332",
            title: "経済史・事情．経済体制",
            titleEn: "Economic history and conditions",
          },
          {
            key: "333",
            title: "経済政策．国際経済",
            titleEn: "Economic policy. International economy",
          },
          {
            key: "334",
            title: "人口．土地．資源",
            titleEn: "Population. Land. Resources",
          },
          {
            key: "335",
            title: "企業．経営",
            titleEn: "Enterprise. Management",
          },
          { key: "336", title: "経営管理", titleEn: "Business management" },
          { key: "337", title: "貨幣．通貨", titleEn: "Money and currency" },
          {
            key: "338",
            title: "金融．銀行．信託",
            titleEn: "Financial economics. Banks and trusts",
          },
          { key: "339", title: "保険", titleEn: "Insurance" },
        ],
        titleEn: "Economics",
      },
      {
        key: "340",
        title: "財政",
        children: [
          {
            key: "341",
            title: "財政学．財政思想",
            titleEn: "Theory of public finance",
          },
          {
            key: "342",
            title: "財政史・事情",
            titleEn: "Fiscal history and conditions",
          },
          {
            key: "343",
            title: "財政政策．財務行政",
            titleEn: "Fiscal policy and administration",
          },
          {
            key: "344",
            title: "予算．決算",
            titleEn: "Budgets and settlements",
          },
          { key: "345", title: "租税", titleEn: "Taxations" },
          { key: "347", title: "公債．国債", titleEn: "Public debts" },
          {
            key: "348",
            title: "専売．国有財産",
            titleEn: "Public monopolies. National property",
          },
          { key: "349", title: "地方財政", titleEn: "Local finance" },
        ],
        titleEn: "Public finance",
      },
      {
        key: "350",
        title: "統計",
        children: [
          { key: "351", title: "日本", titleEn: "Nippon" },
          { key: "352", title: "アジア", titleEn: "Asia" },
          { key: "353", title: "ヨーロッパ", titleEn: "Europe" },
          { key: "354", title: "アフリカ", titleEn: "Africa" },
          { key: "355", title: "北アメリカ", titleEn: "North America" },
          { key: "356", title: "南アメリカ", titleEn: "South America" },
          {
            key: "357",
            title: "オセアニア．両極地方",
            titleEn: "Oceania. Polar regions",
          },
          {
            key: "358",
            title: "人口統計．国勢調査",
            titleEn: "Population statistics",
          },
          {
            key: "359",
            title: "各種の統計書",
            titleEn: "Statistics of specific subjects",
          },
        ],
        titleEn: "Statistics",
      },
      {
        key: "360",
        title: "社会",
        children: [
          { key: "361", title: "社会学", titleEn: "Sociology" },
          {
            key: "362",
            title: "社会史．社会体制",
            titleEn: "Social history. Social system",
          },
          { key: "364", title: "社会保障", titleEn: "Social security" },
          {
            key: "365",
            title: "生活・消費者問題",
            titleEn: "Living and consumer's problems",
          },
          {
            key: "366",
            title: "労働経済．労働問題",
            titleEn: "Labor economics. Labor problems",
          },
          {
            key: "367",
            title: "家族問題．男性・女性問題．老人問題",
            titleEn: "Family. Man and woman. Aged people",
          },
          { key: "368", title: "社会病理", titleEn: "Social pathology" },
          { key: "369", title: "社会福祉", titleEn: "Social welfare" },
        ],
        titleEn: "Society",
      },
      {
        key: "370",
        title: "教育",
        children: [
          {
            key: "371",
            title: "教育学．教育思想",
            titleEn: "Theory of education",
          },
          {
            key: "372",
            title: "教育史・事情",
            titleEn: "History and conditions of education",
          },
          {
            key: "373",
            title: "教育政策．教育制度．教育行財政",
            titleEn: "Educational policy and system",
          },
          {
            key: "374",
            title: "学校経営・管理．学校保健",
            titleEn: "School administration",
          },
          {
            key: "375",
            title: "教育課程．学習指導．教科別教育",
            titleEn: "Curriculums. Methods of instruction and study",
          },
          {
            key: "376",
            title: "幼児・初等・中等教育",
            titleEn: "Pre-school. Elementary and secondary education",
          },
          {
            key: "377",
            title: "大学．高等・専門教育．学術行政",
            titleEn: "Higher education",
          },
          {
            key: "378",
            title: "障害児教育",
            titleEn: "Education for the handicapped children",
          },
          { key: "379", title: "社会教育", titleEn: "Social education" },
        ],
        titleEn: "Education",
      },
      {
        key: "380",
        title: "風俗習慣．民俗学．民族学",
        children: [
          {
            key: "382",
            title: "風俗史．民俗誌．民族誌",
            titleEn:
              "History and descriptions of customs, folklore and ethnology",
          },
          {
            key: "383",
            title: "衣食住の習俗",
            titleEn: "Costumes. Eating and drinking. Housing",
          },
          {
            key: "384",
            title: "社会・家庭生活の習俗",
            titleEn: "Customs of social and domestic life",
          },
          {
            key: "385",
            title: "通過儀礼．冠婚葬祭",
            titleEn: "Customs of life cycle",
          },
          {
            key: "386",
            title: "年中行事．祭礼",
            titleEn: "Annual events. Festivals",
          },
          {
            key: "387",
            title: "民間信仰．迷信［俗信］",
            titleEn: "Popular beliefs",
          },
          {
            key: "388",
            title: "伝説．民話［昔話］",
            titleEn: "Legends. Folk tales",
          },
          {
            key: "389",
            title: "民族学．文化人類学",
            titleEn: "Ethnology. Cultural anthropology",
          },
        ],
        titleEn: "Customs, folklore and ethnology",
      },
      {
        key: "390",
        title: "国防．軍事",
        children: [
          {
            key: "391",
            title: "戦争．戦略．戦術",
            titleEn: "War. Strategy. Tactics",
          },
          {
            key: "392",
            title: "国防史・事情．軍事史・事情",
            titleEn: "History and conditions",
          },
          {
            key: "393",
            title: "国防政策・行政・法令",
            titleEn: "Policy and administration of national defence",
          },
          {
            key: "394",
            title: "軍事医学．兵食",
            titleEn: "Military health services",
          },
          {
            key: "395",
            title: "軍事施設．軍需品",
            titleEn: "Military installations. War supplies",
          },
          { key: "396", title: "陸軍", titleEn: "Armies" },
          { key: "397", title: "海軍", titleEn: "Navies" },
          { key: "398", title: "空軍", titleEn: "Air forces and warfare" },
          {
            key: "399",
            title: "古代兵法．軍学",
            titleEn: "Antiquated arts of war",
          },
        ],
        titleEn: "National defence. Military science",
      },
    ],
    titleEn: "Social sciences",
  },
  {
    key: "400",
    title: "自然科学",
    children: [
      {
        key: "400",
        title: "自然科学",
        children: [
          {
            key: "401",
            title: "科学理論．科学哲学",
            titleEn: "Theory and philosophy",
          },
          {
            key: "402",
            title: "科学史・事情",
            titleEn: "History and conditions",
          },
          {
            key: "403",
            title: "参考図書［レファレンス ブック］",
            titleEn: "Reference books",
          },
          {
            key: "404",
            title: "論文集．評論集．講演集",
            titleEn: "Essays and lectures",
          },
          { key: "405", title: "逐次刊行物", titleEn: "Serial publications" },
          {
            key: "406",
            title: "団体：学会，協会，会議",
            titleEn: "Organizations",
          },
          {
            key: "407",
            title: "研究法．指導法．科学教育",
            titleEn: "Study and teaching",
          },
          {
            key: "408",
            title: "叢書．全集．選集",
            titleEn: "Collected works. Collections",
          },
          {
            key: "409",
            title: "科学技術政策．科学技術行政",
            titleEn: "Science and technology policy",
          },
        ],
        titleEn: "Natural sciences",
      },
      {
        key: "410",
        title: "数学",
        children: [
          { key: "411", title: "代数学", titleEn: "Algebra" },
          { key: "412", title: "数論［整数論］", titleEn: "Theory of numbers" },
          { key: "413", title: "解析学", titleEn: "Analysis" },
          { key: "414", title: "幾何学", titleEn: "Geometry" },
          { key: "415", title: "位相数学", titleEn: "Topological mathematics" },
          {
            key: "417",
            title: "確率論．数理統計学",
            titleEn: "Probabilities. Mathematical statistics",
          },
          { key: "418", title: "計算法", titleEn: "Numerical calculations" },
          {
            key: "419",
            title: "和算．中国算法",
            titleEn: "Mathematics of Nippon and China",
          },
        ],
        titleEn: "Mathematics",
      },
      {
        key: "420",
        title: "物理学",
        children: [
          { key: "421", title: "理論物理学", titleEn: "Theoretical physics" },
          { key: "423", title: "力学", titleEn: "Mechanics" },
          {
            key: "424",
            title: "振動学．音響学",
            titleEn: "Vibrations. Acoustics",
          },
          { key: "425", title: "光学", titleEn: "Optics" },
          { key: "426", title: "熱学", titleEn: "Heat. Thermotics" },
          {
            key: "427",
            title: "電磁気学",
            titleEn: "Electricity and magnetism",
          },
          {
            key: "428",
            title: "物性物理学",
            titleEn: "Physical properties of matter",
          },
          {
            key: "429",
            title: "原子物理学",
            titleEn: "Atomic and nuclear physics",
          },
        ],
        titleEn: "Physics",
      },
      {
        key: "430",
        title: "化学",
        children: [
          {
            key: "431",
            title: "物理化学．理論化学",
            titleEn: "Physical and theoretical chemistry",
          },
          {
            key: "432",
            title: "実験化学［化学実験法］",
            titleEn: "Experimental chemistry",
          },
          {
            key: "433",
            title: "分析化学［化学分析］",
            titleEn: "Analytical chemistry",
          },
          {
            key: "434",
            title: "合成化学［化学合成］",
            titleEn: "Synthetical chemistry",
          },
          { key: "435", title: "無機化学", titleEn: "Inorganic chemistry" },
          {
            key: "436",
            title: "金属元素とその化合物",
            titleEn: "Metallic elements, their compounds",
          },
          { key: "437", title: "有機化学", titleEn: "Organic chemistry" },
          {
            key: "438",
            title: "環式化合物の化学",
            titleEn: "Chemistry of cyclic compounds",
          },
          {
            key: "439",
            title: "天然物質の化学",
            titleEn: "Chemistry of natural products",
          },
        ],
        titleEn: "Chemistry",
      },
      {
        key: "440",
        title: "天文学．宇宙科学",
        children: [
          {
            key: "441",
            title: "理論天文学．数理天文学",
            titleEn: "Theoretical astronomy",
          },
          {
            key: "442",
            title: "実地天文学．天体観測法",
            titleEn: "Practical astronomy",
          },
          { key: "443", title: "恒星．恒星天文学", titleEn: "Fixed stars" },
          { key: "444", title: "太陽．太陽物理学", titleEn: "Sun" },
          { key: "445", title: "惑星．衛星", titleEn: "Planets. Satellites" },
          { key: "446", title: "月", titleEn: "Moon" },
          { key: "447", title: "彗星．流星", titleEn: "Comets. Meteors" },
          {
            key: "448",
            title: "地球．天文地理学",
            titleEn: "Earth. Astronomical geography",
          },
          { key: "449", title: "時法．暦学", titleEn: "Horology. Calendars" },
        ],
        titleEn: "Astronomy. Space sciences",
      },
      {
        key: "450",
        title: "地球科学．地学",
        children: [
          { key: "451", title: "気象学", titleEn: "Meteorology" },
          { key: "452", title: "海洋学", titleEn: "Oceanography" },
          { key: "453", title: "地震学", titleEn: "Seismology" },
          { key: "454", title: "地形学", titleEn: "Geomorphology" },
          { key: "455", title: "地質学", titleEn: "Geology" },
          {
            key: "456",
            title: "地史学．層位学",
            titleEn: "Historical geology. Stratigraphy",
          },
          { key: "457", title: "古生物学．化石", titleEn: "Paleontology" },
          { key: "458", title: "岩石学", titleEn: "Petrology" },
          { key: "459", title: "鉱物学", titleEn: "Mineralogy" },
        ],
        titleEn: "Earth sciences",
      },
      {
        key: "460",
        title: "生物科学．一般生物学",
        children: [
          {
            key: "461",
            title: "理論生物学．生命論",
            titleEn: "Theoretical biology",
          },
          { key: "462", title: "生物地理．生物誌", titleEn: "Biogeography" },
          { key: "463", title: "細胞学", titleEn: "Cytology" },
          { key: "464", title: "生化学", titleEn: "Biochemistry" },
          { key: "465", title: "微生物学", titleEn: "Microbes. Microbiology" },
          { key: "467", title: "遺伝学", titleEn: "Genetics. Evolution" },
          { key: "468", title: "生態学", titleEn: "General ecology" },
          { key: "469", title: "人類学", titleEn: "Anthropology" },
        ],
        titleEn: "Biology",
      },
      {
        key: "470",
        title: "植物学",
        children: [
          { key: "471", title: "一般植物学", titleEn: "General botany" },
          {
            key: "472",
            title: "植物地理．植物誌",
            titleEn: "Phytogeography. Flora",
          },
          { key: "473", title: "葉状植物", titleEn: "Thallophyta" },
          { key: "474", title: "藻類．菌類", titleEn: "Algae and fungi" },
          { key: "475", title: "コケ植物［蘚苔類］", titleEn: "Bryophyta" },
          { key: "476", title: "シダ植物", titleEn: "Pteridophyta" },
          { key: "477", title: "種子植物", titleEn: "Spermatophyta" },
          { key: "478", title: "裸子植物", titleEn: "Gymnospermae" },
          { key: "479", title: "被子植物", titleEn: "Angiospermae" },
        ],
        titleEn: "Botany",
      },
      {
        key: "480",
        title: "動物学",
        children: [
          { key: "481", title: "一般動物学", titleEn: "General zoology" },
          {
            key: "482",
            title: "動物地理．動物誌",
            titleEn: "Zoogeography. Fauna",
          },
          { key: "483", title: "無脊椎動物", titleEn: "Invertebrata" },
          { key: "484", title: "軟体動物．貝類学", titleEn: "Mollusca" },
          { key: "485", title: "節足動物", titleEn: "Arthropoda" },
          { key: "486", title: "昆虫類", titleEn: "Insecta. Entomology" },
          { key: "487", title: "脊椎動物", titleEn: "Vertebrata" },
          { key: "488", title: "鳥類", titleEn: "Aves. Ornithology" },
          { key: "489", title: "哺乳類", titleEn: "Mammalia" },
        ],
        titleEn: "Zoology",
      },
      {
        key: "490",
        title: "医学",
        children: [
          { key: "491", title: "基礎医学", titleEn: "Fundamental medicine" },
          {
            key: "492",
            title: "臨床医学．診断・治療",
            titleEn: "Clinical medicine",
          },
          { key: "493", title: "内科学", titleEn: "Internal medicine" },
          { key: "494", title: "外科学", titleEn: "Surgery" },
          {
            key: "495",
            title: "婦人科学．産科学",
            titleEn: "Gynecology. Obstetrics",
          },
          {
            key: "496",
            title: "眼科学．耳鼻咽喉科学",
            titleEn: "Ophthalmology. Otorhinolaryngology",
          },
          { key: "497", title: "歯科学", titleEn: "Dentistry" },
          {
            key: "498",
            title: "衛生学．公衆衛生．予防医学",
            titleEn: "Hygienics. Public health. Preventive medicine",
          },
          { key: "499", title: "薬学", titleEn: "Pharmaceutics" },
        ],
        titleEn: "Medical sciences",
      },
    ],
    titleEn: "Natural sciences",
  },
  {
    key: "500",
    title: "技術．工学",
    children: [
      {
        key: "500",
        title: "技術．工学",
        children: [
          { key: "501", title: "工業基礎学", titleEn: "Basic engineering" },
          {
            key: "502",
            title: "技術史．工学史",
            titleEn: "History of technology",
          },
          {
            key: "503",
            title: "参考図書［レファレンス ブック］",
            titleEn: "Reference books",
          },
          {
            key: "504",
            title: "論文集．評論集．講演集",
            titleEn: "Essays and lectures",
          },
          { key: "505", title: "逐次刊行物", titleEn: "Serial publications" },
          {
            key: "506",
            title: "団体：学会，協会，会議",
            titleEn: "Organizations",
          },
          {
            key: "507",
            title: "研究法．指導法．技術教育",
            titleEn: "Study and teaching",
          },
          {
            key: "508",
            title: "叢書．全集．選集",
            titleEn: "Collected works. Collections",
          },
          {
            key: "509",
            title: "工業．工業経済",
            titleEn: "Industries. Manufacturing industry",
          },
        ],
        titleEn: "Technology. Engineering",
      },
      {
        key: "510",
        title: "建設工学．土木工学",
        children: [
          {
            key: "511",
            title: "土木力学．建設材料",
            titleEn: "Mechanics and materials",
          },
          { key: "512", title: "測量", titleEn: "Surveying" },
          {
            key: "513",
            title: "土木設計・施工法",
            titleEn: "Designs and executions",
          },
          {
            key: "514",
            title: "道路工学",
            titleEn: "Engineering of roads and highways",
          },
          { key: "515", title: "橋梁工学", titleEn: "Bridge engineering" },
          { key: "516", title: "鉄道工学", titleEn: "Railroad engineering" },
          {
            key: "517",
            title: "河海工学．河川工学",
            titleEn: "Hydraulic engineering",
          },
          {
            key: "518",
            title: "衛生工学．都市工学",
            titleEn: "Sanitary and municipal engineering",
          },
          {
            key: "519",
            title: "公害．環境工学",
            titleEn: "Pollution. Environmental engineering",
          },
        ],
        titleEn: "Construction. Civil engineering",
      },
      {
        key: "520",
        title: "建築学",
        children: [
          { key: "521", title: "日本の建築", titleEn: "Nippon architecture" },
          {
            key: "522",
            title: "東洋の建築．アジアの建築",
            titleEn: "Oriental architecture",
          },
          {
            key: "523",
            title: "西洋の建築．その他の様式の建築",
            titleEn: "Occidental architecture. Others",
          },
          { key: "524", title: "建築構造", titleEn: "Construction" },
          {
            key: "525",
            title: "建築計画・施工",
            titleEn: "Planning. Design. Practices",
          },
          { key: "526", title: "各種の建築", titleEn: "Specific buildings" },
          { key: "527", title: "住宅建築", titleEn: "Residential buildings" },
          {
            key: "528",
            title: "建築設備．設備工学",
            titleEn: "Building utilities",
          },
          {
            key: "529",
            title: "建築意匠・装飾",
            titleEn: "Architectural design and decoration",
          },
        ],
        titleEn: "Architecture. Building",
      },
      {
        key: "530",
        title: "機械工学",
        children: [
          {
            key: "531",
            title: "機械力学・材料・設計",
            titleEn: "Mechanics, materials and design",
          },
          {
            key: "532",
            title: "機械工作．工作機械",
            titleEn: "Machine-shop practice. Machine tools",
          },
          { key: "533", title: "熱機関．熱工学", titleEn: "Heat engines" },
          {
            key: "534",
            title: "流体機械．流体工学",
            titleEn: "Hydraulic and pneumatic machinery",
          },
          {
            key: "535",
            title: "精密機器．光学機器",
            titleEn: "Precision and optical instruments",
          },
          {
            key: "536",
            title: "運輸工学．車輌．運搬機械",
            titleEn: "Transportation engineering",
          },
          {
            key: "537",
            title: "自動車工学",
            titleEn: "Automobile engineering",
          },
          {
            key: "538",
            title: "航空宇宙工学",
            titleEn: "Aerospace engineering",
          },
          { key: "539", title: "原子力工学", titleEn: "Nuclear engineering" },
        ],
        titleEn: "Mechanical engineering",
      },
      {
        key: "540",
        title: "電気工学",
        children: [
          {
            key: "541",
            title: "電気回路・計測・材料",
            titleEn: "Electric circuits, measurements and materials",
          },
          { key: "542", title: "電気機器", titleEn: "Electrical machinery" },
          {
            key: "543",
            title: "発電",
            titleEn: "Generation of electric power",
          },
          {
            key: "544",
            title: "送電．変電．配電",
            titleEn: "Transmission. Transformation. Distribution",
          },
          {
            key: "545",
            title: "電灯．照明．電熱",
            titleEn: "Electric lighting and heating",
          },
          { key: "546", title: "電気鉄道", titleEn: "Electric railroads" },
          {
            key: "547",
            title: "通信工学．電気通信",
            titleEn: "Communication engineering",
          },
          { key: "548", title: "情報工学", titleEn: "Information engineering" },
          { key: "549", title: "電子工学", titleEn: "Electronic engineering" },
        ],
        titleEn: "Electrical engineering",
      },
      {
        key: "550",
        title: "海洋工学．船舶工学",
        children: [
          {
            key: "551",
            title: "理論造船学",
            titleEn: "Theories of shipbuilding",
          },
          {
            key: "552",
            title: "船体構造・材料・施工",
            titleEn: "Hull construction. Materials of hull",
          },
          {
            key: "553",
            title: "船体艤装．船舶設備",
            titleEn: "Equipment and outfit of ships",
          },
          {
            key: "554",
            title: "舶用機関［造機］",
            titleEn: "Marine engineering",
          },
          {
            key: "555",
            title: "船舶修理．保守",
            titleEn: "Refitment of ships. Maintenance",
          },
          {
            key: "556",
            title: "各種の船舶・艦艇",
            titleEn: "Specific ships and boats",
          },
          { key: "557", title: "航海．航海学", titleEn: "Navigation" },
          { key: "558", title: "海洋開発", titleEn: "Sea development" },
          {
            key: "559",
            title: "兵器．軍事工学",
            titleEn: "Weapons. Military engineering",
          },
        ],
        titleEn: "Maritime engineering",
      },
      {
        key: "560",
        title: "金属工学．鉱山工学",
        children: [
          {
            key: "561",
            title: "採鉱．選鉱",
            titleEn: "Exploitation. Ore dressing",
          },
          {
            key: "562",
            title: "各種の金属鉱床・採掘",
            titleEn: "Mining of specific metals",
          },
          {
            key: "563",
            title: "冶金．合金",
            titleEn: "Metallurgy and alloys. Metallography",
          },
          { key: "564", title: "鉄鋼", titleEn: "Ferrous metals" },
          { key: "565", title: "非鉄金属", titleEn: "Nonferrous metals" },
          {
            key: "566",
            title: "金属加工．製造冶金",
            titleEn: "Metallurgical technology",
          },
          { key: "567", title: "石炭", titleEn: "Coal mining" },
          { key: "568", title: "石油", titleEn: "Petroleum mining" },
          {
            key: "569",
            title: "非金属鉱物．土石採取業",
            titleEn: "Non-metalic mining",
          },
        ],
        titleEn: "Metal and mining engineering",
      },
      {
        key: "570",
        title: "化学工業",
        children: [
          {
            key: "571",
            title: "化学工学．化学機器",
            titleEn: "Chemical engineering",
          },
          {
            key: "572",
            title: "電気化学工業",
            titleEn: "Industrial electrochemistry",
          },
          {
            key: "573",
            title: "セラミックス．窯業．珪酸塩化学工業",
            titleEn: "Ceramic technology",
          },
          { key: "574", title: "化学薬品", titleEn: "Industrial chemicals" },
          {
            key: "575",
            title: "燃料．爆発物",
            titleEn: "Fuels and explosives",
          },
          { key: "576", title: "油脂類", titleEn: "Oils and fats" },
          { key: "577", title: "染料", titleEn: "Dyes" },
          {
            key: "578",
            title: "高分子化学工業",
            titleEn: "Polymers. Plastics. Cellulose",
          },
          {
            key: "579",
            title: "その他の化学工業",
            titleEn: "Other chemical technologies",
          },
        ],
        titleEn: "Chemical technology",
      },
      {
        key: "580",
        title: "製造工業",
        children: [
          { key: "581", title: "金属製品", titleEn: "Metal goods" },
          {
            key: "582",
            title: "事務機器．家庭機器．楽器",
            titleEn:
              "Business machines. Household appliances. Musical instrument",
          },
          { key: "583", title: "木工業．木製品", titleEn: "Woodworking" },
          {
            key: "584",
            title: "皮革工業．皮革製品",
            titleEn: "Leather and fur goods",
          },
          {
            key: "585",
            title: "パルプ・製紙工業",
            titleEn: "Pulp and paper industries",
          },
          { key: "586", title: "繊維工学", titleEn: "Textile industry" },
          { key: "587", title: "染色加工．染色業", titleEn: "Dyeing" },
          { key: "588", title: "食品工業", titleEn: "Food technology" },
          {
            key: "589",
            title: "その他の雑工業",
            titleEn: "Other miscellaneous manufactures",
          },
        ],
        titleEn: "Manufactures",
      },
      {
        key: "590",
        title: "家政学．生活科学",
        children: [
          {
            key: "591",
            title: "家庭経済・経営",
            titleEn: "Domestic economy and management",
          },
          {
            key: "592",
            title: "家庭理工学",
            titleEn: "Sciences and technology in household",
          },
          { key: "593", title: "衣服．裁縫", titleEn: "Clothing. Sewing" },
          { key: "594", title: "手芸", titleEn: "Handicrafts" },
          { key: "595", title: "理容．美容", titleEn: "Beauty culture" },
          { key: "596", title: "食品．料理", titleEn: "Food. Cookery" },
          {
            key: "597",
            title: "住居．家具調度",
            titleEn: "Household utilities",
          },
          { key: "598", title: "家庭衛生", titleEn: "Domestic health" },
          { key: "599", title: "育児", titleEn: "Care of children" },
        ],
        titleEn: "Domestic arts and sciences",
      },
    ],
    titleEn: "Technology. Engineering",
  },
  {
    key: "600",
    title: "産業",
    children: [
      {
        key: "600",
        title: "産業",
        children: [
          {
            key: "601",
            title: "産業政策・行政．総合開発",
            titleEn: "Industrial policy and planning",
          },
          {
            key: "602",
            title: "産業史・事情．物産誌",
            titleEn: "History and conditions",
          },
          {
            key: "603",
            title: "参考図書［レファレンス ブック］",
            titleEn: "Reference books",
          },
          {
            key: "604",
            title: "論文集．評論集．講演集",
            titleEn: "Essays and lectures",
          },
          { key: "605", title: "逐次刊行物", titleEn: "Serial publications" },
          {
            key: "606",
            title: "団体：学会，協会，会議",
            titleEn: "Organizations",
          },
          {
            key: "607",
            title: "研究法．指導法．産業教育",
            titleEn: "Study and teaching",
          },
          {
            key: "608",
            title: "叢書．全集．選集",
            titleEn: "Collected works. Collections",
          },
          {
            key: "609",
            title: "度量衡．計量法",
            titleEn: "Weights and measures",
          },
        ],
        titleEn: "Industry and commerce",
      },
      {
        key: "610",
        title: "農業",
        children: [
          { key: "611", title: "農業経済", titleEn: "Agricultural economics" },
          {
            key: "612",
            title: "農業史・事情",
            titleEn: "Agricultural history and conditions",
          },
          {
            key: "613",
            title: "農業基礎学",
            titleEn: "Basic sciences on agriculture",
          },
          {
            key: "614",
            title: "農業工学",
            titleEn: "Agricultural engineering",
          },
          {
            key: "615",
            title: "作物栽培．作物学",
            titleEn: "Methods of cultivation. Crop science",
          },
          { key: "616", title: "食用作物", titleEn: "Edible crops" },
          { key: "617", title: "工芸作物", titleEn: "Industrial crops" },
          { key: "618", title: "繊維作物", titleEn: "Fiber crops" },
          {
            key: "619",
            title: "農産物製造・加工",
            titleEn: "Agricultural technology",
          },
        ],
        titleEn: "Agriculture",
      },
      {
        key: "620",
        title: "園芸",
        children: [
          {
            key: "621",
            title: "園芸経済・行政・経営",
            titleEn: "Gardening economy and management",
          },
          {
            key: "622",
            title: "園芸史・事情",
            titleEn: "Horticultural history and conditions",
          },
          {
            key: "623",
            title: "園芸植物学．病虫害",
            titleEn: "Basic sciences on gardening",
          },
          {
            key: "624",
            title: "温室．温床．園芸用具",
            titleEn: "Green houses and tools",
          },
          {
            key: "625",
            title: "果樹園芸",
            titleEn: "Fruit culture. Pomiculture",
          },
          { key: "626", title: "蔬菜園芸", titleEn: "Vegetable culture" },
          { key: "627", title: "花卉園芸［草花］", titleEn: "Floriculture" },
          {
            key: "628",
            title: "園芸利用",
            titleEn: "Utilization of garden products",
          },
          { key: "629", title: "造園", titleEn: "Landscape gardening" },
        ],
        titleEn: "Horticulture",
      },
      {
        key: "630",
        title: "蚕糸業",
        children: [
          {
            key: "631",
            title: "蚕糸経済・行政・経営",
            titleEn: "Sericultural economy and management",
          },
          {
            key: "632",
            title: "蚕糸業史・事情",
            titleEn: "Sericultural history and conditions",
          },
          {
            key: "633",
            title: "蚕学．蚕業基礎学",
            titleEn: "Natural history of silkworms",
          },
          { key: "634", title: "蚕種", titleEn: "Silkworm eggs" },
          { key: "635", title: "飼育法", titleEn: "Rearing of silkworms" },
          { key: "636", title: "くわ．栽桑", titleEn: "Mulberry culture" },
          {
            key: "637",
            title: "蚕室．蚕具",
            titleEn: "Sericultural rooms and implements",
          },
          { key: "638", title: "まゆ", titleEn: "Cocoon" },
          {
            key: "639",
            title: "製糸．生糸．蚕糸利用",
            titleEn: "Raw silk production",
          },
        ],
        titleEn: "Sericulture. Silk industry",
      },
      {
        key: "640",
        title: "畜産業",
        children: [
          {
            key: "641",
            title: "畜産経済・行政・経営",
            titleEn: "Animal economy and management",
          },
          {
            key: "642",
            title: "畜産史・事情",
            titleEn: "History and conditions",
          },
          {
            key: "643",
            title: "家畜の繁殖．家畜飼料",
            titleEn: "Stock breeding. Forage",
          },
          {
            key: "644",
            title: "家畜の管理．畜舎．用具",
            titleEn: "Cotes and implements",
          },
          {
            key: "645",
            title: "家畜・畜産動物各論",
            titleEn: "Domestic animals",
          },
          {
            key: "646",
            title: "家禽各論．飼鳥",
            titleEn: "Aviculture. Poultry",
          },
          {
            key: "647",
            title: "みつばち．昆虫",
            titleEn: "Apiculture. Beekeeping",
          },
          { key: "648", title: "畜産製造．畜産物", titleEn: "Animal industry" },
          {
            key: "649",
            title: "獣医学．比較医学",
            titleEn: "Veterinary medicine",
          },
        ],
        titleEn: "Animal husbandry",
      },
      {
        key: "650",
        title: "林業",
        children: [
          {
            key: "651",
            title: "林業経済・行政・経営",
            titleEn: "Forest economics",
          },
          {
            key: "652",
            title: "森林史．林業史・事情",
            titleEn: "History and conditions",
          },
          {
            key: "653",
            title: "森林立地．造林",
            titleEn: "Forest ecology. Silviculture",
          },
          { key: "654", title: "森林保護", titleEn: "Forest protection" },
          { key: "655", title: "森林施業", titleEn: "Forest administration" },
          { key: "656", title: "森林工学", titleEn: "Forest engineering" },
          {
            key: "657",
            title: "森林利用．林産物．木材学",
            titleEn: "Forest utilization",
          },
          { key: "658", title: "林産製造", titleEn: "Forest technology" },
          { key: "659", title: "狩猟", titleEn: "Hunting and shooting" },
        ],
        titleEn: "Forestry",
      },
      {
        key: "660",
        title: "水産業",
        children: [
          {
            key: "661",
            title: "水産経済・行政・経営",
            titleEn: "Fishing economics and management",
          },
          {
            key: "662",
            title: "水産業および漁業史・事情",
            titleEn: "History and conditions",
          },
          {
            key: "663",
            title: "水産基礎学",
            titleEn: "Basic sciences on fishery",
          },
          { key: "664", title: "漁労．漁業各論", titleEn: "Fishing" },
          {
            key: "665",
            title: "漁船．漁具",
            titleEn: "Fishing boats and implements",
          },
          { key: "666", title: "水産増殖．養殖業", titleEn: "Aquaculture" },
          {
            key: "667",
            title: "水産製造．水産食品",
            titleEn: "Fish technology",
          },
          {
            key: "668",
            title: "水産物利用．水産利用工業",
            titleEn: "Utilization of aquatic products",
          },
          { key: "669", title: "製塩．塩業", titleEn: "Salt manufacture" },
        ],
        titleEn: "Fishing industry. Fisheries",
      },
      {
        key: "670",
        title: "商業",
        children: [
          { key: "671", title: "商業政策・行政", titleEn: "Commercial policy" },
          {
            key: "672",
            title: "商業史・事情",
            titleEn: "History and conditions",
          },
          {
            key: "673",
            title: "商業経営．商店",
            titleEn: "Mercantile business",
          },
          {
            key: "674",
            title: "広告．宣伝",
            titleEn: "Advertising. Propaganda. Public relations",
          },
          { key: "675", title: "マーケティング", titleEn: "Marketing" },
          { key: "676", title: "取引所", titleEn: "Exchanges" },
          { key: "678", title: "貿易", titleEn: "Foreign trade" },
        ],
        titleEn: "Commerce",
      },
      {
        key: "680",
        title: "運輸．交通",
        children: [
          {
            key: "681",
            title: "交通政策・行政・経営",
            titleEn: "Traffic policy and management",
          },
          {
            key: "682",
            title: "交通史・事情",
            titleEn: "History and conditions",
          },
          {
            key: "683",
            title: "海運",
            titleEn: "Maritime transport. Shipping",
          },
          {
            key: "684",
            title: "内水・運河交通",
            titleEn: "Inland water ways. Canal transportation",
          },
          {
            key: "685",
            title: "陸運．自動車運送",
            titleEn: "Land transportation",
          },
          { key: "686", title: "鉄道", titleEn: "Railways" },
          { key: "687", title: "航空運送", titleEn: "Air transportation" },
          { key: "688", title: "倉庫業", titleEn: "Warehouses" },
          { key: "689", title: "観光事業", titleEn: "Tourist industry" },
        ],
        titleEn: "Transportation services",
      },
      {
        key: "690",
        title: "通信事業",
        children: [
          {
            key: "691",
            title: "通信政策・行政・法令",
            titleEn: "Policy, administration and laws",
          },
          {
            key: "692",
            title: "通信事業史・事情",
            titleEn: "History and conditions",
          },
          { key: "693", title: "郵便．郵政事業", titleEn: "Postal services" },
          { key: "694", title: "電気通信事業", titleEn: "Telecommunication" },
          {
            key: "699",
            title: "放送事業：テレビ，ラジオ",
            titleEn: "Broadcasting",
          },
        ],
        titleEn: "Communication services",
      },
    ],
    titleEn: "Industry and commerce",
  },
  {
    key: "700",
    title: "芸術．美術",
    children: [
      {
        key: "700",
        title: "芸術．美術",
        children: [
          {
            key: "701",
            title: "芸術理論．美学",
            titleEn: "Theory of arts. Aesthetics",
          },
          { key: "702", title: "芸術史．美術史", titleEn: "History of arts" },
          {
            key: "703",
            title: "参考図書［レファレンス ブック］",
            titleEn: "Reference books",
          },
          {
            key: "704",
            title: "論文集．評論集．講演集",
            titleEn: "Essays and lectures",
          },
          { key: "705", title: "逐次刊行物", titleEn: "Serial publications" },
          {
            key: "706",
            title: "団体：学会，協会，会議",
            titleEn: "Organizations",
          },
          {
            key: "707",
            title: "研究法．指導法．芸術教育",
            titleEn: "Study and teaching. Art education",
          },
          {
            key: "708",
            title: "叢書．全集．選集",
            titleEn: "Collected works. Collections",
          },
          {
            key: "709",
            title: "芸術政策．文化財",
            titleEn: "Art and state. Cultural assets",
          },
        ],
        titleEn: "The arts. Fine arts",
      },
      {
        key: "710",
        title: "彫刻",
        children: [
          {
            key: "711",
            title: "彫塑材料・技法",
            titleEn: "Materials and techniques",
          },
          {
            key: "712",
            title: "彫刻史．各国の彫刻",
            titleEn: "History of sculpture",
          },
          { key: "713", title: "木彫", titleEn: "Wood carving" },
          { key: "714", title: "石彫", titleEn: "Stone carving" },
          {
            key: "715",
            title: "金属彫刻．鋳造",
            titleEn: "Metal sculpture and casting",
          },
          { key: "717", title: "粘土彫刻．塑造", titleEn: "Ceramic sculpture" },
          { key: "718", title: "仏像", titleEn: "Buddhist image" },
          { key: "719", title: "オブジェ", titleEn: "Objet" },
        ],
        titleEn: "Sculpture. Plastic arts",
      },
      {
        key: "720",
        title: "絵画",
        children: [
          { key: "721", title: "日本画", titleEn: "Nipponese painting" },
          { key: "722", title: "東洋画", titleEn: "Oriental painting" },
          { key: "723", title: "洋画", titleEn: "Western painting" },
          {
            key: "724",
            title: "絵画材料・技法",
            titleEn: "Materials and techniques",
          },
          { key: "725", title: "素描．描画", titleEn: "Dessin. Drawing" },
          {
            key: "726",
            title: "漫画．挿絵．童画",
            titleEn: "Caricatures. Illustration",
          },
          {
            key: "727",
            title: "グラフィック デザイン．図案",
            titleEn: "Graphic designs",
          },
          { key: "728", title: "書．書道", titleEn: "Shodô. Calligraphy" },
        ],
        titleEn: "Painting. Pictorial arts",
      },
      {
        key: "730",
        title: "版画",
        children: [
          {
            key: "731",
            title: "版画材料・技法",
            titleEn: "Materials and techniques",
          },
          {
            key: "732",
            title: "版画史．各国の版画",
            titleEn: "History of engraving",
          },
          { key: "733", title: "木版画", titleEn: "Wood engraving" },
          { key: "734", title: "石版画", titleEn: "Lithography" },
          {
            key: "735",
            title: "銅版画．鋼版画",
            titleEn: "Copperplate and steel engraving",
          },
          {
            key: "736",
            title: "リノリウム版画．ゴム版画",
            titleEn: "Soft-ground engraving",
          },
          {
            key: "737",
            title: "写真版画．孔版画",
            titleEn: "Photo-engraving. Mimeograph",
          },
          { key: "739", title: "印章．篆刻．印譜", titleEn: "Seal engraving" },
        ],
        titleEn: "Engraving",
      },
      {
        key: "740",
        title: "写真",
        children: [
          {
            key: "742",
            title: "写真器械・材料",
            titleEn: "Camera and photographic materials",
          },
          { key: "743", title: "撮影技術", titleEn: "Photographing" },
          {
            key: "744",
            title: "現像．印画",
            titleEn: "Developing and printing",
          },
          {
            key: "745",
            title: "複写技術",
            titleEn: "Photoduplication. Photocopying",
          },
          {
            key: "746",
            title: "特殊写真",
            titleEn: "Specific field of photography",
          },
          {
            key: "747",
            title: "写真の応用",
            titleEn: "Applications of photography",
          },
          {
            key: "748",
            title: "写真集",
            titleEn: "Collections of photographs",
          },
          { key: "749", title: "印刷", titleEn: "Printing. Graphic arts" },
        ],
        titleEn: "Photography and photographs",
      },
      {
        key: "750",
        title: "工芸",
        children: [
          { key: "751", title: "陶磁工芸", titleEn: "Ceramic arts" },
          { key: "752", title: "漆工芸", titleEn: "Lacquer ware" },
          { key: "753", title: "染織工芸", titleEn: "Textile arts" },
          {
            key: "754",
            title: "木竹工芸",
            titleEn: "Art wood work and bamboo-work",
          },
          {
            key: "755",
            title: "宝石・牙角・皮革工芸",
            titleEn: "Jewelry arts. Ivory and horn carving",
          },
          { key: "756", title: "金工芸", titleEn: "Art metalwork" },
          {
            key: "757",
            title: "デザイン．装飾美術",
            titleEn: "Design. Decorative arts",
          },
          { key: "758", title: "美術家具", titleEn: "Artistic furniture" },
          { key: "759", title: "人形．玩具", titleEn: "Dolls. Toys" },
        ],
        titleEn: "Industrial arts",
      },
      {
        key: "760",
        title: "音楽",
        children: [
          {
            key: "761",
            title: "音楽の一般理論．音楽学",
            titleEn: "Musicology",
          },
          {
            key: "762",
            title: "音楽史．各国の音楽",
            titleEn: "History of music",
          },
          {
            key: "763",
            title: "楽器．器楽",
            titleEn: "Musical instruments. Instrumental music",
          },
          { key: "764", title: "器楽合奏", titleEn: "Instrumental ensembles" },
          {
            key: "765",
            title: "宗教音楽．聖楽",
            titleEn: "Religious music. Sacred music",
          },
          { key: "766", title: "劇音楽", titleEn: "Dramatic music" },
          { key: "767", title: "声楽", titleEn: "Vocal music" },
          { key: "768", title: "邦楽", titleEn: "Nipponese music" },
          {
            key: "769",
            title: "舞踊．バレエ",
            titleEn: "Theatrical dancing. Ballet",
          },
        ],
        titleEn: "Music",
      },
      {
        key: "770",
        title: "演劇",
        children: [
          {
            key: "771",
            title: "劇場．演出．演技",
            titleEn: "Stage. Direction. Acting",
          },
          {
            key: "772",
            title: "演劇史．各国の演劇",
            titleEn: "History of theater",
          },
          {
            key: "773",
            title: "能楽．狂言",
            titleEn: "Noh play and Noh comedy",
          },
          { key: "774", title: "歌舞伎", titleEn: "Kabuki play" },
          { key: "775", title: "各種の演劇", titleEn: "Other theaters. Stage" },
          { key: "777", title: "人形劇", titleEn: "Puppetry" },
          { key: "778", title: "映画", titleEn: "Motion pictures" },
          { key: "779", title: "大衆演芸", titleEn: "Public entertainments" },
        ],
        titleEn: "Theater",
      },
      {
        key: "780",
        title: "スポーツ．体育",
        children: [
          { key: "781", title: "体操．遊戯", titleEn: "Gymnastics. Plays" },
          {
            key: "782",
            title: "陸上競技",
            titleEn: "Track and field athletics",
          },
          { key: "783", title: "球技", titleEn: "Ball games" },
          { key: "784", title: "冬季競技", titleEn: "Winter sports" },
          { key: "785", title: "水上競技", titleEn: "Aquatic sports" },
          {
            key: "786",
            title: "戸外レクリエーション",
            titleEn: "Outdoor recreations",
          },
          {
            key: "787",
            title: "釣魚．遊猟",
            titleEn: "Angling and hunting sports",
          },
          {
            key: "788",
            title: "相撲．拳闘．競馬",
            titleEn: "Combat sports. Racing",
          },
          { key: "789", title: "武術", titleEn: "Military arts" },
        ],
        titleEn: "Sports and physical training",
      },
      {
        key: "790",
        title: "諸芸．娯楽",
        children: [
          { key: "791", title: "茶道", titleEn: "Tea ceremony" },
          { key: "792", title: "香道", titleEn: "Burning incense" },
          { key: "793", title: "花道", titleEn: "Art of flower arrangement" },
          { key: "794", title: "撞球", titleEn: "Billiards" },
          { key: "795", title: "囲碁", titleEn: "Game of go" },
          { key: "796", title: "将棋", titleEn: "Game of shogi" },
          { key: "797", title: "射倖ゲーム", titleEn: "Games of chance" },
          { key: "798", title: "室内娯楽", titleEn: "Indoor games" },
          { key: "799", title: "ダンス", titleEn: "Dancing" },
        ],
        titleEn: "Accomplishments and amusements",
      },
    ],
    titleEn: "The arts. Fine arts",
  },
  {
    key: "800",
    title: "言語",
    children: [
      {
        key: "800",
        title: "言語",
        children: [
          { key: "801", title: "言語学", titleEn: "Linguistics. Philology" },
          {
            key: "802",
            title: "言語史・事情．言語政策",
            titleEn: "History and conditions",
          },
          {
            key: "803",
            title: "参考図書［レファレンス ブック］",
            titleEn: "Reference books",
          },
          {
            key: "804",
            title: "論文集．評論集．講演集",
            titleEn: "Essays and lectures",
          },
          { key: "805", title: "逐次刊行物", titleEn: "Serial publications" },
          {
            key: "806",
            title: "団体：学会，協会，会議",
            titleEn: "Organizations",
          },
          {
            key: "807",
            title: "研究法．指導法．言語教育",
            titleEn: "Study and teaching",
          },
          {
            key: "808",
            title: "叢書．全集．選集",
            titleEn: "Collected works. Collections",
          },
          {
            key: "809",
            title: "言語生活",
            titleEn: "Speaking. Shorthand. Typewriting",
          },
        ],
        titleEn: "Language",
      },
      {
        key: "810",
        title: "日本語",
        children: [
          {
            key: "811",
            title: "音声．音韻．文字",
            titleEn: "Phonetics. Phonology. Writing",
          },
          { key: "812", title: "語源．意味", titleEn: "Etymology. Semantics" },
          { key: "813", title: "辞典", titleEn: "Dictionaries" },
          { key: "814", title: "語彙", titleEn: "Vocabularies" },
          { key: "815", title: "文法．語法", titleEn: "Grammar" },
          {
            key: "816",
            title: "文章．文体．作文",
            titleEn: "Sentences. Styles. Compositions",
          },
          {
            key: "817",
            title: "読本．解釈．会話",
            titleEn: "Readers. Interpretations. Conversations",
          },
          { key: "818", title: "方言．訛語", titleEn: "Dialects" },
        ],
        titleEn: "Nipponese",
      },
      {
        key: "820",
        title: "中国語",
        children: [
          {
            key: "821",
            title: "音声．音韻．文字",
            titleEn: "Phonetics. Phonology. Writing",
          },
          { key: "822", title: "語源．意味", titleEn: "Etymology. Semantics" },
          { key: "823", title: "辞典", titleEn: "Dictionaries" },
          { key: "824", title: "語彙", titleEn: "Vocabularies" },
          { key: "825", title: "文法．語法", titleEn: "Grammar" },
          {
            key: "826",
            title: "文章．文体．作文",
            titleEn: "Sentences. Styles. Compositions",
          },
          {
            key: "827",
            title: "読本．解釈．会話",
            titleEn: "Readers. Interpretations. Conversations",
          },
          { key: "828", title: "方言．訛語", titleEn: "Dialects" },
          {
            key: "829",
            title: "その他の東洋の諸言語",
            titleEn: "Other Oriental languages",
          },
        ],
        titleEn: "Chinese",
      },
      {
        key: "830",
        title: "英語",
        children: [
          {
            key: "831",
            title: "音声．音韻．文字",
            titleEn: "Phonetics. Phonology. Writing",
          },
          { key: "832", title: "語源．意味", titleEn: "Etymology. Semantics" },
          { key: "833", title: "辞典", titleEn: "Dictionaries" },
          { key: "834", title: "語彙", titleEn: "Vocabularies" },
          { key: "835", title: "文法．語法", titleEn: "Grammar" },
          {
            key: "836",
            title: "文章．文体．作文",
            titleEn: "Sentences. Styles. Compositions",
          },
          {
            key: "837",
            title: "読本．解釈．会話",
            titleEn: "Readers. Interpretations. Conversations",
          },
          { key: "838", title: "方言．訛語", titleEn: "Dialects" },
        ],
        titleEn: "English",
      },
      {
        key: "840",
        title: "ドイツ語",
        children: [
          {
            key: "841",
            title: "音声．音韻．文字",
            titleEn: "Phonetics. Phonology. Writing",
          },
          {
            key: "842",
            title: "語源．語義．意味",
            titleEn: "Etymology. Semantics",
          },
          { key: "843", title: "辞典", titleEn: "Dictionaries" },
          { key: "844", title: "語彙", titleEn: "Vocabularies" },
          { key: "845", title: "文法．語法", titleEn: "Grammar" },
          {
            key: "846",
            title: "文章．文体．作文",
            titleEn: "Sentences. Styles. Compositions",
          },
          {
            key: "847",
            title: "読本．解釈．会話",
            titleEn: "Readers. Interpretations. Conversations",
          },
          { key: "848", title: "方言．訛語", titleEn: "Dialects" },
          {
            key: "849",
            title: "その他のゲルマン諸語",
            titleEn: "Other Germanic languages",
          },
        ],
        titleEn: "German",
      },
      {
        key: "850",
        title: "フランス語",
        children: [
          {
            key: "851",
            title: "音声．音韻．文字",
            titleEn: "Phonetics. Phonology. Writing",
          },
          {
            key: "852",
            title: "語源．語義．意味",
            titleEn: "Etymology. Semantics",
          },
          { key: "853", title: "辞典", titleEn: "Dictionaries" },
          { key: "854", title: "語彙", titleEn: "Vocabularies" },
          { key: "855", title: "文法．語法", titleEn: "Grammar" },
          {
            key: "856",
            title: "文章．文体．作文",
            titleEn: "Sentences. Styles. Compositions",
          },
          {
            key: "857",
            title: "読本．解釈．会話",
            titleEn: "Readers. Interpretations. Conversations",
          },
          { key: "858", title: "方言．訛語", titleEn: "Dialects" },
          { key: "859", title: "プロヴァンス語", titleEn: "Provençal" },
        ],
        titleEn: "French",
      },
      {
        key: "860",
        title: "スペイン語",
        children: [
          {
            key: "861",
            title: "音声．音韻．文字",
            titleEn: "Phonetics. Phonology. Writing",
          },
          {
            key: "862",
            title: "語源．語義．意味",
            titleEn: "Etymology. Semantics",
          },
          { key: "863", title: "辞典", titleEn: "Dictionaries" },
          { key: "864", title: "語彙", titleEn: "Vocabularies" },
          { key: "865", title: "文法．語法", titleEn: "Grammar" },
          {
            key: "866",
            title: "文章．文体．作文",
            titleEn: "Sentences. Styles. Compositions",
          },
          {
            key: "867",
            title: "読本．解釈．会話",
            titleEn: "Readers. Interpretations. Conversations",
          },
          { key: "868", title: "方言．訛語", titleEn: "Dialects" },
          { key: "869", title: "ポルトガル語", titleEn: "Portuguese" },
        ],
        titleEn: "Spanish",
      },
      {
        key: "870",
        title: "イタリア語",
        children: [
          {
            key: "871",
            title: "音声．音韻．文字",
            titleEn: "Phonetics. Phonology. Writing",
          },
          {
            key: "872",
            title: "語源．語義．意味",
            titleEn: "Etymology. Semantics",
          },
          { key: "873", title: "辞典", titleEn: "Dictionaries" },
          { key: "874", title: "語彙", titleEn: "Vocabularies" },
          { key: "875", title: "文法．語法", titleEn: "Grammar" },
          {
            key: "876",
            title: "文章．文体．作文",
            titleEn: "Sentences. Styles. Compositions",
          },
          {
            key: "877",
            title: "読本．解釈．会話",
            titleEn: "Readers. Interpretations. Conversations",
          },
          { key: "878", title: "方言．訛語", titleEn: "Dialects" },
          {
            key: "879",
            title: "その他のロマンス諸語",
            titleEn: "Other Romanic languages",
          },
        ],
        titleEn: "Italian",
      },
      {
        key: "880",
        title: "ロシア語",
        children: [
          {
            key: "881",
            title: "音声．音韻．文字",
            titleEn: "Phonetics. Phonology. Writing",
          },
          {
            key: "882",
            title: "語源．語義．意味",
            titleEn: "Etymology. Semantics",
          },
          { key: "883", title: "辞典", titleEn: "Dictionaries" },
          { key: "884", title: "語彙", titleEn: "Vocabularies" },
          { key: "885", title: "文法．語法", titleEn: "Grammar" },
          {
            key: "886",
            title: "文章．文体．作文",
            titleEn: "Sentences. Styles. Compositions",
          },
          {
            key: "887",
            title: "読本．解釈．会話",
            titleEn: "Readers. Interpretations. Conversations",
          },
          { key: "888", title: "方言．訛語", titleEn: "Dialects" },
          {
            key: "889",
            title: "その他のスラヴ諸語",
            titleEn: "Other Slavic languages",
          },
        ],
        titleEn: "Russian",
      },
      {
        key: "890",
        title: "その他の諸言語",
        children: [
          { key: "891", title: "ギリシア語", titleEn: "Greek" },
          { key: "892", title: "ラテン語", titleEn: "Latin" },
          {
            key: "893",
            title: "その他のヨーロッパの諸言語",
            titleEn: "Other European languages",
          },
          {
            key: "894",
            title: "アフリカの諸言語",
            titleEn: "African languages",
          },
          {
            key: "895",
            title: "アメリカの諸言語",
            titleEn: "American Indian languages",
          },
          {
            key: "897",
            title: "オーストラリアの諸言語",
            titleEn: "Australian languages",
          },
          {
            key: "899",
            title: "国際語［人工語］",
            titleEn: "Universal languages",
          },
        ],
        titleEn: "Other languages",
      },
    ],
    titleEn: "Language",
  },
  {
    key: "900",
    title: "文学",
    children: [
      {
        key: "900",
        title: "文学",
        children: [
          {
            key: "901",
            title: "文学理論・作法",
            titleEn: "Theory and techniques",
          },
          {
            key: "902",
            title: "文学史．文学思想史",
            titleEn: "History and criticism",
          },
          {
            key: "903",
            title: "参考図書［レファレンス ブック］",
            titleEn: "Reference books",
          },
          {
            key: "904",
            title: "論文集．評論集．講演集",
            titleEn: "Essays and lectures",
          },
          { key: "905", title: "逐次刊行物", titleEn: "Serial publications" },
          {
            key: "906",
            title: "団体：学会，協会，会議",
            titleEn: "Organizations",
          },
          {
            key: "907",
            title: "研究法．指導法．文学教育",
            titleEn: "Study and teaching",
          },
          {
            key: "908",
            title: "叢書．全集．選集",
            titleEn: "Series. Collections",
          },
          {
            key: "909",
            title: "児童文学研究",
            titleEn: "Study of juvenile literature",
          },
        ],
        titleEn: "Literature",
      },
      {
        key: "910",
        title: "日本文学",
        children: [
          { key: "911", title: "詩歌", titleEn: "Poetry" },
          { key: "912", title: "戯曲", titleEn: "Drama" },
          {
            key: "913",
            title: "小説．物語",
            titleEn: "Fiction. Romance. Novel",
          },
          {
            key: "914",
            title: "評論．エッセイ．随筆",
            titleEn: "Essays. Prose",
          },
          {
            key: "915",
            title: "日記．書簡．紀行",
            titleEn: "Diaries. Letters. Travels",
          },
          {
            key: "916",
            title: "記録．手記．ルポルタージュ",
            titleEn: "Reportage",
          },
          {
            key: "917",
            title: "箴言．アフォリズム．寸言",
            titleEn: "Aphorism",
          },
          { key: "918", title: "作品集：全集，選集", titleEn: "Collections" },
          {
            key: "919",
            title: "漢詩文．日本漢文学",
            titleEn: "Chinese poetry and prose",
          },
        ],
        titleEn: "Nipponese literature",
      },
      {
        key: "920",
        title: "中国文学",
        children: [
          { key: "921", title: "詩歌．韻文．詩文", titleEn: "Poetry" },
          { key: "922", title: "戯曲", titleEn: "Drama" },
          {
            key: "923",
            title: "小説．物語",
            titleEn: "Fiction. Romance. Novel",
          },
          {
            key: "924",
            title: "評論．エッセイ．随筆",
            titleEn: "Essays. Prose",
          },
          {
            key: "925",
            title: "日記．書簡．紀行",
            titleEn: "Diaries. Letters. Travels",
          },
          {
            key: "926",
            title: "記録．手記．ルポルタージュ",
            titleEn: "Reportage",
          },
          {
            key: "927",
            title: "箴言．アフォリズム．寸言",
            titleEn: "Aphorism",
          },
          { key: "928", title: "作品集：全集，選集", titleEn: "Collections" },
          {
            key: "929",
            title: "その他の東洋文学",
            titleEn: "Other Oriental literatures",
          },
        ],
        titleEn: "Chinese literature",
      },
      {
        key: "930",
        title: "英米文学",
        children: [
          { key: "931", title: "詩", titleEn: "Poetry" },
          { key: "932", title: "戯曲", titleEn: "Drama" },
          {
            key: "933",
            title: "小説．物語",
            titleEn: "Fiction. Romance. Novel",
          },
          {
            key: "934",
            title: "評論．エッセイ．随筆",
            titleEn: "Essays. Prose",
          },
          {
            key: "935",
            title: "日記．書簡．紀行",
            titleEn: "Diaries. Letters. Travels",
          },
          {
            key: "936",
            title: "記録．手記．ルポルタージュ",
            titleEn: "Reportage",
          },
          {
            key: "937",
            title: "箴言．アフォリズム．寸言",
            titleEn: "Aphorism",
          },
          { key: "938", title: "作品集：全集，選集", titleEn: "Collections" },
          {
            key: "939",
            title: "アメリカ文学",
            titleEn: "American literature",
          },
        ],
        titleEn: "English and American literature",
      },
      {
        key: "940",
        title: "ドイツ文学",
        children: [
          { key: "941", title: "詩", titleEn: "Poetry" },
          { key: "942", title: "戯曲", titleEn: "Drama" },
          {
            key: "943",
            title: "小説．物語",
            titleEn: "Fiction. Romance. Novel",
          },
          {
            key: "944",
            title: "評論．エッセイ．随筆",
            titleEn: "Essays. Prose",
          },
          {
            key: "945",
            title: "日記．書簡．紀行",
            titleEn: "Diaries. Letters. Travels",
          },
          {
            key: "946",
            title: "記録．手記．ルポルタージュ",
            titleEn: "Reportage",
          },
          {
            key: "947",
            title: "箴言．アフォリズム．寸言",
            titleEn: "Aphorism",
          },
          { key: "948", title: "作品集：全集，選集", titleEn: "Collections" },
          {
            key: "949",
            title: "その他のゲルマン文学",
            titleEn: "Other Germanic literatures",
          },
        ],
        titleEn: "German literature",
      },
      {
        key: "950",
        title: "フランス文学",
        children: [
          { key: "951", title: "詩", titleEn: "Poetry" },
          { key: "952", title: "戯曲", titleEn: "Drama" },
          {
            key: "953",
            title: "小説．物語",
            titleEn: "Fiction. Romance. Novel",
          },
          {
            key: "954",
            title: "評論．エッセイ．随筆",
            titleEn: "Essays. Prose",
          },
          {
            key: "955",
            title: "日記．書簡．紀行",
            titleEn: "Diaries. Letters. Travels",
          },
          {
            key: "956",
            title: "記録．手記．ルポルタージュ",
            titleEn: "Reportage",
          },
          {
            key: "957",
            title: "箴言．アフォリズム．寸言",
            titleEn: "Aphorism",
          },
          { key: "958", title: "作品集：全集，選集", titleEn: "Collections" },
          {
            key: "959",
            title: "プロヴァンス文学",
            titleEn: "Provençal literature",
          },
        ],
        titleEn: "French literature",
      },
      {
        key: "960",
        title: "スペイン文学",
        children: [
          { key: "961", title: "詩", titleEn: "Poetry" },
          { key: "962", title: "戯曲", titleEn: "Drama" },
          {
            key: "963",
            title: "小説．物語",
            titleEn: "Fiction. Romance. Novel",
          },
          {
            key: "964",
            title: "評論．エッセイ．随筆",
            titleEn: "Essays. Prose",
          },
          {
            key: "965",
            title: "日記．書簡．紀行",
            titleEn: "Diaries. Letters. Travels",
          },
          {
            key: "966",
            title: "記録．手記．ルポルタージュ",
            titleEn: "Reportage",
          },
          {
            key: "967",
            title: "箴言．アフォリズム．寸言",
            titleEn: "Aphorism",
          },
          { key: "968", title: "作品集：全集，選集", titleEn: "Collections" },
          {
            key: "969",
            title: "ポルトガル文学",
            titleEn: "Portuguese literature",
          },
        ],
        titleEn: "Spanish literature",
      },
      {
        key: "970",
        title: "イタリア文学",
        children: [
          { key: "971", title: "詩歌", titleEn: "Poetry" },
          { key: "972", title: "戯曲", titleEn: "Drama" },
          { key: "973", title: "小説", titleEn: "Fiction. Romance. Novel" },
          {
            key: "974",
            title: "評論．エッセイ．随筆",
            titleEn: "Essays. Prose",
          },
          {
            key: "975",
            title: "日記．書簡．紀行",
            titleEn: "Diaries. Letters. Travels",
          },
          {
            key: "976",
            title: "記録．手記．ルポルタージュ",
            titleEn: "Reportage",
          },
          {
            key: "977",
            title: "アフォリズム．警句．寸言",
            titleEn: "Aphorism",
          },
          { key: "978", title: "作品集：全集，選集", titleEn: "Collections" },
          {
            key: "979",
            title: "その他のロマンス文学",
            titleEn: "Other Romanic literatures",
          },
        ],
        titleEn: "Italian literature",
      },
      {
        key: "980",
        title: "ロシア・ソビエト文学",
        children: [
          { key: "981", title: "詩歌", titleEn: "Poetry" },
          { key: "982", title: "戯曲", titleEn: "Drama" },
          { key: "983", title: "小説", titleEn: "Fiction. Romance. Novel" },
          {
            key: "984",
            title: "評論．エッセイ．随筆",
            titleEn: "Essays. Prose",
          },
          {
            key: "985",
            title: "日記．書簡．紀行",
            titleEn: "Diaries. Letters. Travels",
          },
          {
            key: "986",
            title: "記録．手記．ルポルタージュ",
            titleEn: "Reportage",
          },
          {
            key: "987",
            title: "アフォリズム．警句．寸言",
            titleEn: "Aphorism",
          },
          { key: "988", title: "作品集：全集，選集", titleEn: "Collections" },
          {
            key: "989",
            title: "その他のスラヴ文学",
            titleEn: "Other Slavic literatures",
          },
        ],
        titleEn: "Russian literature",
      },
      {
        key: "990",
        title: "その他の諸文学",
        children: [
          { key: "991", title: "ギリシア文学", titleEn: "Greek literature" },
          { key: "992", title: "ラテン文学", titleEn: "Latin literature" },
          {
            key: "993",
            title: "その他のヨーロッパ文学",
            titleEn: "Other European literatures",
          },
          { key: "994", title: "アフリカ文学", titleEn: "African literatures" },
          {
            key: "995",
            title: "アメリカ先住民語の文学",
            titleEn: "Literatures of American native languages",
          },
          {
            key: "997",
            title: "オーストラリア先住民語の文学",
            titleEn: "Literatures of Australian native languages",
          },
          {
            key: "999",
            title: "国際語による文学",
            titleEn: "Literatures of universal languages",
          },
        ],
        titleEn: "Literatures of other languages",
      },
    ],
    titleEn: "Literature",
  },
];
