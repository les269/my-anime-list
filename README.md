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
- 各種清單過濾
- ~~table video-data key=原名類型+type(video-type or video-tag) value 為值~~
- ~~table video-type key 名稱 desc 描述(可重複) 設定在 video-data 的 value 為自定義(固定與功能相關)(取消)~~
- table video-tag key tag desc 描述(不可重複) 設定在 video-data 的 value 為 boolean
- ~~編輯 video-tag 的畫面~~
- ~~可以自訂 tag(使用 video-type) 用來標註(ex:不想看，待看，棄坑，神作)~~
- ~~清單顯示樣式可以兩種~~
- 搜尋沒到資料使用 like 去查詢以清單讓其選擇 沒資料才顯示找無資料 單筆直接顯示 多筆開窗清單選擇一筆
- 配置設定要可以 預計要有 local 的 url 可以讀取到圖片 當我 server 沒開才去讀取原本的網址
- 圖片自動下載到 local 圖片庫裡 設定按鈕可以刪除圖片
- ~~可以自己留言~~
- ~~標註看到哪一集~~
- ~~瀏覽清單右上角編輯圖案(編輯完同步更新畫面)~~
- ~~維基百科按鈕顯示~~
- ~~顯示大綱~~
- ~~清單搜尋功能~~
