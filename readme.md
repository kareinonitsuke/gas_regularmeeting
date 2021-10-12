# ローカルでのGAS開発環境を構築する
以下の記事の通り環境構築する(Google Apps Script APIを許可するまで) \
https://coxcox.hatenablog.com/entry/2019/04/05/222532 \
※Claspのインストールの「sudo npm install @google/clasp -g」はMSYS2とかCygwinとかで適当にたたいておく

# プロジェクトを紐づけ
VSCodeのTerminalで以下実行
```
clasp login
//ブラウザが出るので許可など
//プロジェクトを保存したいフォルダに移動(今回はD:\Source\test)
clasp clone XXXXXXXXXXXXXXXXXXXXXXXXXXX
```

# GitHubから既存のプロジェクトを引っ張ってくる
\
git bashとかで以下を実行
```
git init
git remote add origin https://github.com/kareinonitsuke/gas_regulermeeting.git
git pull
git checkout -b develop_surveyform
```