# MuscleMap 部署指南

## 前置作業完成清單 ✅

已為你完成以下準備工作：

1. ✅ 修改 API 配置 (src/services/api.js)
2. ✅ 調整 Quasar 配置 (quasar.config.js)
3. ✅ 創建生產環境變數 (.env.production)
4. ✅ 建立 GitHub Actions 自動部署 (.github/workflows/deploy.yml)
5. ✅ 更新 package.json 配置
6. ✅ 初始化 Git 儲存庫

## 接下來的部署步驟

### 步驟 1: 修改配置中的佔位符號

**重要！** 請先修改以下文件中的佔位符號：

1. **package.json** (第8-12行)

   ```json
   "homepage": "https://你的GitHub用戶名.github.io/MuscleMap/",
   "repository": {
     "type": "git",
     "url": "https://github.com/你的GitHub用戶名/MuscleMap.git"
   }
   ```

2. **.env.production**

   ```
   VITE_API_URL=https://你的後端API地址
   ```

3. **src/services/api.js** (第11-16行)
   ```javascript
   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || 'https://你的後端API地址',
   })
   ```

### 步驟 2: 在 GitHub 上建立儲存庫

1. 前往 [GitHub](https://github.com)
2. 點擊右上角的 "+" → "New repository"
3. 儲存庫名稱填寫: `MuscleMap`
4. 選擇 "Public" (如果要使用免費的 GitHub Pages)
5. **不要**勾選 "Add a README file" (我們已經有了)
6. 點擊 "Create repository"

### 步驟 3: 連接本地儲存庫到 GitHub

在命令提示字元中執行以下指令：

```bash
# 切換到專案目錄
cd "d:\11401_FrontEnd\MuscleMap"

# 添加遠端儲存庫 (請替換為你的 GitHub 用戶名)
git remote add origin https://github.com/你的GitHub用戶名/MuscleMap.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步驟 4: 啟用 GitHub Pages

1. 進入你的 GitHub 儲存庫頁面
2. 點擊 "Settings" 標籤
3. 在左側選單中找到 "Pages"
4. 在 "Source" 下拉選單中選擇 "GitHub Actions"
5. 等待第一次自動部署完成 (約 2-5 分鐘)

### 步驟 5: 檢查部署狀態

1. 在儲存庫頁面點擊 "Actions" 標籤
2. 查看 "Deploy to GitHub Pages" 工作流程是否成功
3. 如果成功，你的網站將可在以下網址訪問：
   `https://你的GitHub用戶名.github.io/MuscleMap/`

## 後續維護

### 自動部署

- 每次推送到 `main` 分支時，GitHub Actions 會自動重新建置和部署網站

### 手動更新

如果需要更新，只需要：

```bash
git add .
git commit -m "更新描述"
git push
```

### 修改 API 地址

如果後端 API 地址改變，只需要：

1. 修改 `.env.production` 中的 `VITE_API_URL`
2. 提交並推送更改

## 故障排除

### 常見問題：

1. **404 錯誤**: 檢查 GitHub Pages 是否正確設定為 "GitHub Actions"
2. **CSS/JS 載入失敗**: 確認 `quasar.config.js` 中的 `publicPath` 設定正確
3. **API 連線失敗**: 確認後端 API 地址正確且支援 CORS

### 檢查建置日誌：

在 GitHub → Actions → 點擊失敗的工作流程 → 查看詳細錯誤訊息

## 注意事項

1. **API 地址**: 確保你的後端 API 支援 HTTPS 和 CORS
2. **環境變數**: 生產環境和開發環境使用不同的 API 地址
3. **路由模式**: 使用 Hash 模式 (`vueRouterMode: 'hash'`) 以確保在 GitHub Pages 上正常運作
4. **快取**: GitHub Pages 可能會快取舊版本，可能需要強制重新整理 (Ctrl+F5)
