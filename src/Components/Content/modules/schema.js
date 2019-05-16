const dataSchema = {
  // カード用タイトル ユーザが編集画面で入力
  title: 'string',
  // カード用イメージ   ユーザが編集画面で入力
  image: '',
  // カード用リード
  lead: '',
  // 記事のデータ
  section: [],
  // 作成日 
  createdOn: '',
  // 編集日
  lastEdited: '',
  // ドキュメントのパス
  location: {
    collection: '',
    document: '',
    subcollection: '',
    subdocument: ''
  },
  // 新しい構成の記事データであることを管理ページで確認するためのプロパティー
  // このプロパティーがfalseまたは存在しない場合は記事を非公開にしたり、編集することができません
  NEWCONTENTTYPE: 'true',
  // 作成した年と月 (ex. 201804) ここは変えて頂いて大丈夫です。
  // このデータはFirebaseでしか編集できません。
  id: '', // date
  // ランダムな文字列 パスを指定するために利用
  to: '', // random unique stringO
  // これは何なのかわかりませんが、既存の記事データにこのプロパティーがあるので念のためここでも追加します。
  isOpenFlg: true,
  // SEO最適化用にデータ (?) 記事を作成するとき一回しか入力できません。編集したい場合はFirebaseで編集してください。
  metadata: {
    description: '',
    title: ''
  }
};
