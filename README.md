## 介紹

新增編輯自定義影片清單 以官方名稱為主其他資料可以自行填寫

```
//local run
npm run start

//docker
docker build -t my-anime-list .
docker run -d -p 8092:80 --name my-anime-list-container my-anime-list
```

## feature

- 調整元件，修改畫面
- label、標題調整畫面
- 設定可劃分影片種類(EX.動畫 電影 影集 ...)
- 各種清單過濾
- 搜尋沒到資料使用 like 去查詢以清單讓其選擇 沒資料才顯示找無資料 單筆直接顯示 多筆開窗清單選擇一筆
- 配置設定要可以 預計要有 local 的 url 可以讀取到圖片 當我 server 沒開才去讀取原本的網址
- 圖片自動下載到 local 圖片庫裡 設定按鈕可以刪除圖片
