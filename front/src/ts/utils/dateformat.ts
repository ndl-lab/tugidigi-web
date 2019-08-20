/**
 *
 * https://github.com/hrdaya/UltraDate.js
 * を参考
 *
 * フォーマットの書式に基づき文字列を変換する関数
 *
 * @param {Date} date フォーマットに使用するDateオブジェクト
 * @param {String} format フォーマットする文字列
 * @return {String} 書式に基づき変換した文字列
 */
export function format(date: Date, format: string): string {
  // 引数dateが日付オブジェクトでない場合は例外をスロー
  if (
    isNaN(date.getTime()) ||
    Object.prototype.toString.call(date) !== "[object Date]"
  ) {
    throw new Error("引数「date」を認識できません");
  }

  // 引数formatが文字列でない場合は例外をスロー
  if (typeof format !== "string") {
    throw new Error("引数「format」が文字列ではありません");
  }

  // 和暦用オブジェクト
  var jp = {
    // MMMで使用する日本の月名の配列
    month: [
      "睦月",
      "如月",
      "弥生",
      "卯月",
      "皐月",
      "水無月",
      "文月",
      "葉月",
      "長月",
      "神無月",
      "霜月",
      "師走"
    ],

    // DDD、DDで使用する曜日に使用する配列
    day: ["日", "月", "火", "水", "木", "金", "土"],

    // TTで使用する配列
    noonJp: ["午前", "午後"],

    // ttで使用する配列
    noonEn: ["AM", "PM"],

    /**
     * ggg、gg、g、ee、eで使用する和暦と元号を取得する関数
     *
     * @param {Date} date 和暦を取得するためのDateオブジェクト
     * @return {Object} 和暦用のデータを格納したオブジェクト
     */
    era: function(date) {
      var year = date.getFullYear();
      // 戻り値の初期値
      var ret = {
        longName: "西暦",
        shortName: "西",
        alphaName: "AD",
        year: year
      };

      // 明治以降の和暦を取得する
      if (year > 1988) {
        // 1989年以降は平成
        ret = {
          longName: "平成",
          shortName: "平",
          alphaName: "H",
          year: year - 1988
        };
      } else if (year > 1925) {
        // 1926年以降は昭和
        ret = {
          longName: "昭和",
          shortName: "昭",
          alphaName: "S",
          year: year - 1925
        };
      } else if (year > 1911) {
        // 1912年以降は大正
        ret = {
          longName: "大正",
          shortName: "大",
          alphaName: "T",
          year: year - 1911
        };
      } else if (year > 1867) {
        // 1868年以降は明治
        ret = {
          longName: "明治",
          shortName: "明",
          alphaName: "M",
          year: year - 1867
        };
      }
      return ret;
    }
  };

  // ヘルパー関数
  var func: any = {
    /**
     * 任意の桁数に切り取った文字列を返す（桁数に足りない場合は0埋め）
     *
     * @param {Number} val 0埋めする数字
     * @param {Number} num 桁数
     * @return {String} 0埋めした文字列
     */
    padSlice: function(val, num) {
      // 桁数が指定されていない時は2桁
      if (num === undefined) {
        num = 2;
      }

      // 要素数numの配列を区切り文字"0"で結合しvalを結合
      // 出来た文字列の右側からnum文字を切り出す
      return (new Array(num).join("0") + val).slice(num * -1);
    },

    /**
     * 任意の桁数に0埋めした文字列を返す（桁数を超える場合はそのまま）
     *
     * @param {Number} val 0埋めする数字
     * @param {Number} num 桁数
     * @return {String} 0埋めした文字列
     */
    padLoop: function(val, num) {
      // 桁数が指定されていない時は2桁
      if (num === undefined) {
        num = 2;
      }

      // valを文字列に変換
      val = val.toString();

      // 桁数に達するまで左に0を足す
      while (val.length < num) {
        val = "0" + val;
      }

      return val;
    }
  };

  // 午前を0、午後を1として値を取得します
  var noon = date.getHours() < 12 ? 0 : 1;

  // 和暦の元号等のオブジェクトを取得します
  var era = jp.era(date);

  /**
   * フォーマットの設定
   *
   * キー：変換する文字列
   * 値：変換に使用する関数等
   */
  var formatting = {
    yyyy: func.padSlice(date.getFullYear(), 4),
    yy: func.padSlice(date.getFullYear()),
    ee: func.padLoop(era.year),
    e: era.year,
    ggg: era.longName,
    gg: era.shortName,
    g: era.alphaName,
    MMM: jp.month[date.getMonth()],
    MM: func.padSlice(date.getMonth() + 1),
    M: date.getMonth() + 1,
    dd: func.padSlice(date.getDate()),
    d: date.getDate(),
    HH: func.padSlice(date.getHours()),
    H: date.getHours(),
    hh: func.padSlice(date.getHours() - 12 * noon),
    h: date.getHours() - 12 * noon,
    mm: func.padSlice(date.getMinutes()),
    m: date.getMinutes(),
    ss: func.padSlice(date.getSeconds()),
    s: date.getSeconds(),
    fff: func.padSlice(date.getMilliseconds(), 3),
    f: date.getMilliseconds(),
    TT: jp.noonJp[noon],
    tt: jp.noonEn[noon],
    DDD: jp.day[date.getDay()] + "曜日",
    DD: jp.day[date.getDay()]
  };

  // フォーマットの実行

  // 「""」連続したダブルクォートを一旦エスケープしておくための文字列
  // こんな文字列指定しないだろうという文字列
  var esc = "_____-----_____-----_____-----_____-----_____-----_____";

  // 「""」連続したダブルクォートのエスケープ
  format = format.replace(/("")/g, esc);

  // 「"」ダブルクォートで文字列を分割
  var split = format.split('"');

  // 変換に使用する正規表現文字列の作成
  // 後で文字列を連結するために一旦フォーマット設定のキーを配列に収める
  var regs: any[] = [];
  for (var key in formatting) {
    regs.push(key);
  }

  // キャプチャする括弧内に「または」で連結
  let regsStr = "(" + regs.join("|") + ")";

  // 正規表現オブジェクトの作成
  var reg = new RegExp(regsStr, "g");

  // ダブルクォートで囲まれた範囲は変換しないので、
  // 分割してできた配列の0から2おきに変換を実施する
  for (var i = 0, len = split.length; i < len; i += 2) {
    split[i] = split[i].replace(reg, function(match) {
      return formatting[match];
    });
  }

  // 変換し終わった配列を区切り文字なしで結合する
  format = split.join("");

  // 最初にエスケープしておいた「""」連続したダブルクォートの文字列を
  // 「"」ダブルクォートの文字列として変換する
  format = format.replace(new RegExp("(" + esc + ")", "g"), '"');

  // 変換した文字列を返す
  return format;
}
