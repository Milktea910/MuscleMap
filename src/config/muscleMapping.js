// 肌肉名稱統一配置文件

// 英文肌肉ID到中文名稱的映射
export const englishToChinese = {
  // 上半身
  chests: '胸大肌',
  chest: '胸大肌',
  upper_chest: '上胸肌',

  // 肩部
  front_shoulders: '肩前束',
  middle_shoulders: '肩中束',
  back_shoulders: '肩後束',

  // 手臂
  biceps: '肱二頭肌',
  triceps: '肱三頭肌',
  forearms: '前臂',
  hands: '手', // 手部點擊對應手部肌群

  // 背部
  front_trapezius: '斜方肌',
  back_trapezius: '斜方肌',
  traps_middle: '菱形肌', // 修正：traps_middle 對應菱形肌
  // 移除 traps: '斜方肌', - MaleFront 中沒有對應的點擊事件
  lats: '背闊肌',
  rhomboids: '菱形肌', // 保留 rhomboids 也對應菱形肌（備用）
  lower_back: '豎脊肌',

  // 核心
  abs: '腹直肌',
  flank: '腹內外斜肌',

  // 下半身
  front_thighs: '股四頭肌',
  back_thighs: '大腿後側肌群',
  butts: '臀大肌',
  glutes: '臀大肌',

  // 腿部
  front_calfs: '小腿肌群',
  back_calfs: '小腿肌群',
  calves: '小腿肌群',
}

// 中文肌肉名稱到肌肉圖部位ID的映射（用於高亮顯示）
export const muscleToPartMapping = {
  // 胸部 - 修正映射關係
  胸大肌: ['chests'], // 對應 SVG 中的點擊事件
  上胸肌: ['upper_chest'],

  // 肩部 - 修正重疊問題，使用更精確的部位映射
  肩前束: ['front_shoulders'], // 對應點擊事件 front_shoulders，高亮 anterior-deltoid
  肩中束: ['middle_shoulders'], // 對應點擊事件 middle_shoulders，高亮 front-shoulders
  肩後束: ['back_shoulders'],

  // 手臂
  肱二頭肌: ['biceps'],
  肱三頭肌: ['triceps'],
  前臂: ['forearms'],
  手: ['hands'],

  // 背部
  斜方肌: ['front_trapezius', 'back_trapezius'], // 移除 traps，只保留實際存在的部位
  背闊肌: ['lats'],
  菱形肌: ['traps_middle'], // 修正：菱形肌對應 traps_middle
  豎脊肌: ['lower_back'],

  // 核心
  腹直肌: ['abs'],
  腹內外斜肌: ['flank'],

  // 下半身
  股四頭肌: ['front_thighs', 'quads'],
  大腿後側肌群: ['back_thighs', 'hamstrings'],
  臀大肌: ['butts', 'glutes'],
  小腿肌群: ['front_calfs', 'back_calfs', 'calves'],

  // 組合肌群（用於更寬泛的搜索）- 修正重疊問題
  三角肌: ['anterior-deltoid', 'front-shoulders', 'back_shoulders'], // 修正肩部組合
  胸肌: ['chest'], // 移除重疊，胸肌只指向基本胸部
  背肌: ['lats', 'traps_middle', 'lower_back'], // 修正：使用 traps_middle 而非 rhomboids
  臀肌: ['butts', 'glutes'],
  腿部: ['front_thighs', 'back_thighs', 'quads', 'hamstrings'],
}

// 後端數據庫中使用的肌肉名稱（對應Exercise模型的enum）
export const validMuscleNames = [
  '胸大肌',
  '上胸肌',
  '斜方肌',
  '背闊肌',
  '菱形肌',
  '豎脊肌',
  '肩前束',
  '肩中束',
  '肩後束',
  '肱二頭肌',
  '肱三頭肌',
  '前臂',
  '手',
  '腹直肌',
  '腹內外斜肌',
  '股四頭肌',
  '大腿後側肌群',
  '臀大肌',
  '小腿肌群',
]

// 肌肉群分類
export const muscleCategories = {
  上半身: {
    胸部: ['胸大肌', '上胸肌'],
    肩部: ['肩前束', '肩中束', '肩後束'],
    手臂: ['肱二頭肌', '肱三頭肌', '前臂', '手'],
    背部: ['斜方肌', '背闊肌', '菱形肌', '豎脊肌'],
  },
  核心: {
    腹部: ['腹直肌', '腹內外斜肌'],
  },
  下半身: {
    臀部: ['臀大肌'],
    大腿: ['股四頭肌', '大腿後側肌群'],
    小腿: ['小腿肌群'],
  },
}

// 肌肉名稱別名映射（處理同義詞）
export const muscleAliases = {
  // 胸部
  胸肌: '胸大肌',
  胸肌上部: '上胸肌',

  // 肩部
  三角肌前束: '肩前束',
  前三角肌: '肩前束',
  三角肌中束: '肩中束',
  中三角肌: '肩中束',
  三角肌後束: '肩後束',
  後三角肌: '肩後束',

  // 其他
  臀肌: '臀大肌',
  小腿: '小腿肌群',
}

// 獲取肌肉的中文名稱
export function getChineseName(englishName) {
  return englishToChinese[englishName] || englishName
}

// 獲取肌肉對應的高亮部位
export function getHighlightParts(chineseName) {
  return muscleToPartMapping[chineseName] || []
}

// 驗證是否為有效的肌肉名稱
export function isValidMuscleName(name) {
  return validMuscleNames.includes(name)
}

// 解析肌肉別名
export function resolveMuscleAlias(name) {
  return muscleAliases[name] || name
}
