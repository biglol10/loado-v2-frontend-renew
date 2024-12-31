import DefaultImage from '@/assets/images/refine/loado_logo.png';

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
};

export { t3_imageCollection };
