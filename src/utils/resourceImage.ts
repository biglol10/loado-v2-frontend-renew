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

const t3_imageCollection = {
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

const t4_imageCollection = {
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

export { t3_imageCollection, t4_imageCollection };
