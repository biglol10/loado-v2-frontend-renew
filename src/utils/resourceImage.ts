import DefaultImage from '@/assets/images/refine/loado_logo.png';
import GoldImage from '@/assets/images/goldImage2.png';

const itemImageCollection = import.meta.glob('@/assets/images/items/*', { eager: true }); // eager: true로 동기적 로딩

// 1. 주어진 키로 이미지 파일 경로 검색
// 2. 동적으로 이미지 모듈 로드
// 3. 에러 처리 및 로깅
// 4. 이미지 URL 반환
const getImageFromCollectionByKey = (key: string) => {
  try {
    const imagePath = Object.keys(itemImageCollection).find((path) => path.includes(key));

    if (!imagePath) {
      console.warn(`이미지를 찾을 수 없습니다. ${key}`);
      return DefaultImage;
    }

    return (itemImageCollection[imagePath] as { default: string }).default;
  } catch (error) {
    console.error(`이미지 로드 오류: ${error}`);
    return DefaultImage;
  }
};

const t3_imageCollection2 = {
  명예의파편: getImageFromCollectionByKey('명예의파편'),
  책: getImageFromCollectionByKey('armorbook'),
  파괴석: getImageFromCollectionByKey('정제된파괴강석'),
  수호석: getImageFromCollectionByKey('정제된수호강석'),
  오레하: getImageFromCollectionByKey('최상급오레하'),
  가호: getImageFromCollectionByKey('태양의가호'),
  은총: getImageFromCollectionByKey('태양의은총'),
  축복: getImageFromCollectionByKey('태양의축복'),
  찬명돌: getImageFromCollectionByKey('찬명돌'),
  재봉술복합: getImageFromCollectionByKey('재봉술복합'),
  야금술복합: getImageFromCollectionByKey('야금술복합'),
  골드: GoldImage,
};

const t3_imageCollection = {
  '66130133': {
    name: '명예의 파편 주머니(대)',
    image: getImageFromCollectionByKey('명예의파편'),
  },
  '66112542': {
    name: '야금술 : 쇠락 [16-19]',
    image: getImageFromCollectionByKey('야금술복합'),
  },
  '66112545': {
    name: '재봉술 : 쇠락 [16-19]',
    image: getImageFromCollectionByKey('재봉술복합'),
  },
  '66102005': {
    name: '정제된 파괴강석',
    image: getImageFromCollectionByKey('정제된파괴강석'),
  },
  '66102105': {
    name: '정제된 수호강석',
    image: getImageFromCollectionByKey('정제된수호강석'),
  },
  '6861011': {
    name: '최상급 오레하 융화 재료',
    image: getImageFromCollectionByKey('최상급오레하'),
  },
  '66111123': {
    name: '태양의 가호',
    image: getImageFromCollectionByKey('태양의가호'),
  },
  '66111122': {
    name: '태양의 축복',
    image: getImageFromCollectionByKey('태양의축복'),
  },
  '66111121': {
    name: '태양의 은총',
    image: getImageFromCollectionByKey('태양의은총'),
  },
  '66110224': {
    name: '찬란한 명예의 돌파석',
    image: getImageFromCollectionByKey('찬명돌'),
  },
  armorbook: {
    name: '책',
    image: getImageFromCollectionByKey('armorbook'),
  },
  gold: {
    name: '골드',
    image: GoldImage,
  },
};

// 사용되지 않는 변수에 언더스코어(_) 접두사 추가
const _t4_imageCollection2 = {
  운명의파편: getImageFromCollectionByKey('운명의파편'),
  재봉술업화: getImageFromCollectionByKey('재봉술업화'),
  야금술업화: getImageFromCollectionByKey('야금술업화'),
  운명의파괴석: getImageFromCollectionByKey('운명의파괴석'),
  운명의수호석: getImageFromCollectionByKey('운명의수호석'),
  아비도스: getImageFromCollectionByKey('아비도스'),
  용암의숨결: getImageFromCollectionByKey('용암'),
  빙하의숨결: getImageFromCollectionByKey('빙하'),
  운명의돌파석: getImageFromCollectionByKey('운돌'),
  골드: GoldImage,
};

const t4_imageCollection = {
  '66130143': {
    name: '운명의 파편 주머니(대)',
    image: getImageFromCollectionByKey('운명의파편'),
  },
  '66112546': {
    name: '재봉술 : 업화 [11-14]',
    image: getImageFromCollectionByKey('재봉술업화'),
  },
  '66112543': {
    name: '야금술 : 업화 [11-14]',
    image: getImageFromCollectionByKey('야금술업화'),
  },
  '66102006': {
    name: '운명의 파괴석',
    image: getImageFromCollectionByKey('운명의파괴석'),
  },
  '66102106': {
    name: '운명의 수호석',
    image: getImageFromCollectionByKey('운명의수호석'),
  },
  '6861012': {
    name: '아비도스 융화 재료',
    image: getImageFromCollectionByKey('아비도스'),
  },
  '66110225': {
    name: '운명의 돌파석',
    image: getImageFromCollectionByKey('운돌'),
  },
  '66111131': {
    name: '용암의 숨결',
    image: getImageFromCollectionByKey('용암'),
  },
  '66111132': {
    name: '빙하의 숨결',
    image: getImageFromCollectionByKey('빙하'),
  },
  gold: {
    name: '골드',
    image: GoldImage,
  },
};

export { t3_imageCollection, t3_imageCollection2, t4_imageCollection };
