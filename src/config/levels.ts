/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LevelConfig } from '../types/game';

export const CULTIVATION_REWARD_PER_CLEAR = 5;

export const ARRAY_LEVELS: LevelConfig[] = [
  {
    level: 1,
    name: '仙門石鎖',
    targetLines: 10,
    title: '初入陣門',
    element: '青靈石紋',
    description: '仙境山門之始，靈石天然凝結之鎖。穩紮穩打，方能窺見陣道微光。',
    flavorText: '凡人入道，先定心神。十行消解，靈鎖自開。',
  },
  {
    level: 2,
    name: '古墓石門',
    targetLines: 20,
    title: '破陣學徒',
    element: '幽冥玄石',
    description: '古修遺府之外層石門，符文錯綜複雜，需冷靜佈陣尋找破綻。',
    flavorText: '心如止水，手隨意動。二十道石符化為無形。',
  },
  {
    level: 3,
    name: '迷霧幻陣',
    targetLines: 30,
    title: '破陣能手',
    element: '太虛雲霧',
    description: '山嵐聚氣而成之幻象，虛實相生，考驗破陣者的洞察與節奏。',
    flavorText: '撥開雲霧見青天，三十行陣痕盡化靈光。',
  },
  {
    level: 4,
    name: '九宮鎖陣',
    targetLines: 40,
    title: '陣法行者',
    element: '金樞乾坤',
    description: '暗合九宮八卦運轉之樞紐，方塊落位須胸有成竹、步步為營。',
    flavorText: '九宮定乾坤，四十破陣印，靈台明朗。',
  },
  {
    level: 5,
    name: '秘境封印',
    targetLines: 50,
    title: '破陣高手',
    element: '洞天寒玉',
    description: '上古秘境天池入口，寒氣凝聚成晶，非深厚陣意不可化解。',
    flavorText: '五十行破印，寒玉消融，道意漸顯。',
  },
  {
    level: 6,
    name: '天機石壁',
    targetLines: 60,
    title: '玄門破陣師',
    element: '星羅天樞',
    description: '通天絕壁刻畫無窮天機，星點流轉變幻莫測，需氣定神閒方能通達。',
    flavorText: '六十步踏破天機，玄門之師名揚四海。',
  },
  {
    level: 7,
    name: '玄門禁制',
    targetLines: 70,
    title: '破陣宗師',
    element: '紫霄天雷',
    description: '古玄宗正殿防護禁制，靈力奔湧交織，稍有不慎即滿盤受制。',
    flavorText: '七十行宗師氣度，任憑風浪起，穩坐釣魚船。',
  },
  {
    level: 8,
    name: '上古封陣',
    targetLines: 80,
    title: '破陣大宗師',
    element: '太清神炎',
    description: '太古神魔封印殘陣，歷經萬載不滅，唯有心境超然方可連消破陣。',
    flavorText: '八十載道行凝縮一瞬，大宗師之境已入化境。',
  },
  {
    level: 9,
    name: '天地大陣',
    targetLines: 90,
    title: '破陣至尊',
    element: '混沌鴻蒙',
    description: '終極造化陣法，蘊含陰陽初開之機。破此陣者，天下萬陣皆不可阻。',
    flavorText: '九十行天地合一，大道至簡。破陣至尊，登峰造極！',
  },
];

export function getLevelConfig(level: number): LevelConfig {
  const found = ARRAY_LEVELS.find((l) => l.level === level);
  return found || ARRAY_LEVELS[0];
}

export function getTitleForLevel(level: number): string {
  const cfg = getLevelConfig(level);
  return cfg.title;
}
