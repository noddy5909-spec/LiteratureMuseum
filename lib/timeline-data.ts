export type TimelineEra = {
  id: string;
  label: string;
};

export type LiteraryWork = {
  id: string;
  eraId: string;
  title: string;
  poet: string;
  content: string;
};

export const timelineEras: TimelineEra[] = [
  { id: "enlightenment", label: "개화기" },
  { id: "1910s", label: "1910년대" },
  { id: "1920s", label: "1920년대" },
  { id: "1930s-liberation", label: "1930년대~광복 직전" },
  { id: "post-liberation", label: "광복 직후" },
  { id: "1950s", label: "1950년대" },
  { id: "1960s", label: "1960년대" },
  { id: "1970s", label: "1970년대" },
  { id: "1980s", label: "1980년대" },
  { id: "1990s-plus", label: "1990년대 이후" },
];

export const literaryWorks: LiteraryWork[] = [
  {
    id: "nim-ui-chimmuk",
    eraId: "1920s",
    title: "님의 침묵",
    poet: "한용운",
    content: `님은 갔습니다. 아아 사랑하는 나의 님은 갔습니다.
푸른 산빛을 깨치고 단풍나무 숲을 향하여 난 작은 길을 걸어서 차마 떨치고 갔습니다.
황금의 꽃같이 굳고 빛나던 옛 맹세는 차디찬 티끌이 되어서 한숨의 미풍에 날아갔습니다.
날카로운 첫 키스의 추억은 나의 운명의 지침을 돌려놓고 뒷걸음쳐서 사라졌습니다.
나는 향기로운 님의 말소리에 귀먹고 꽃다운 님의 얼굴에 눈멀었습니다.
사랑도 사람의 일이라 만날 때에 미리 떠날 것을 염려하고 경계하지 아니한 것은 아니지만, 이별은 뜻밖의 일이 되고 놀란 가슴은 새로운 슬픔에 터집니다.
그러나 이별을 쓸데없는 눈물의 원천을 만들고 마는 것은 스스로 사랑을 깨치는 것인 줄 아는 까닭에 걷잡을 수 없는 슬픔의 힘을 옮겨서 새 희망의 정수박이에 들이부었습니다.
우리는 만날 때에 떠날 것을 염려하는 것과 같이 떠날 때에 다시 만날 것을 믿습니다.
아아, 님은 갔지마는 나는 님을 보내지 아니하였습니다.
제 곡조를 못 이기는 사랑의 노래는 님의 침묵을 휩싸고 돕니다.`,
  },
  {
    id: "yeoseung",
    eraId: "1930s-liberation",
    title: "여승",
    poet: "백석",
    content: `여승은 합장하고 절을 했다
가지취의 내음새가 났다
쓸쓸한 낯이 옛날같이 늙었다
나는 불경처럼 서러워졌다

평안도의 어늬 산 깊은 금덤판
나는 파리한 여인에게서 옥수수를 샀다
여인은 나아 어린 딸아이를 따리며 가을밤같이 차게 울었다

섶벌같이 나아간 지아비 기다려 십년이 갔다
지아비는 돌아오지 않고
어린 딸은 도라지꽃이 좋아 돌무덤으로 갔다

산꿩도 설게 울은 슬픈 날이 있었다
산절의 마당귀에 여인의 머리오리가 눈물방울과 같이 떨어진 날이 있었다`,
  },
  {
    id: "moran",
    eraId: "1930s-liberation",
    title: "모란이 피기까지는",
    poet: "김영랑",
    content: `모란이 피기까지는
나는 아직 나의 봄을 기둘리고 있을 테요
모란이 뚝뚝 떨어져버린 날
나는 비로소 봄을 여읜 설움에 잠길 테요
오월 어느 날 그 하루 무덥던 날
떨어져 누운 꽃잎마저 시들어버리고는
천지에 모란은 자취도 없어지고
뻗쳐오르던 내 보람 서운케 무너졌느니
모란이 지고 말면 그뿐 내 한 해는 다 가고 말아
삼백예순 날 하냥 섭섭해 우옵내다
모란이 피기까지는
나는 아직 기둘리고 있을 테요 찬란한 슬픔의 봄을`,
  },
];

export function getEraById(id: string): TimelineEra | undefined {
  return timelineEras.find((era) => era.id === id);
}

export function getWorksByEraId(eraId: string): LiteraryWork[] {
  return literaryWorks.filter((work) => work.eraId === eraId);
}

export function getWorkById(id: string): LiteraryWork | undefined {
  return literaryWorks.find((work) => work.id === id);
}
