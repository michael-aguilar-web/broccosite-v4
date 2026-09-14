import sword from '../../assets/tft/components/sword.png';
import bow from '../../assets/tft/components/bow.png';
import rod from '../../assets/tft/components/rod.png';
import tear from '../../assets/tft/components/tear.png';
import vest from '../../assets/tft/components/vest.png';
import cloak from '../../assets/tft/components/cloak.png';
import belt from '../../assets/tft/components/belt.png';
import gloves from '../../assets/tft/components/gloves.png';
import spatula from '../../assets/tft/components/spatula.png';
import fryingPan from '../../assets/tft/components/frying-pan.png';

// Original Riot Data Dragon images. Names also serve as accessible image labels.
// Source/version details are recorded alongside the image files in README.md.
export const tftComponents = {
  sword: { name: 'B.F. Sword', image: sword, riotId: 'TFT_Item_BFSword' },
  bow: { name: 'Recurve Bow', image: bow, riotId: 'TFT_Item_RecurveBow' },
  rod: { name: 'Needlessly Large Rod', image: rod, riotId: 'TFT_Item_NeedlesslyLargeRod' },
  tear: { name: 'Tear of the Goddess', image: tear, riotId: 'TFT_Item_TearOfTheGoddess' },
  vest: { name: 'Chain Vest', image: vest, riotId: 'TFT_Item_ChainVest' },
  cloak: { name: 'Negatron Cloak', image: cloak, riotId: 'TFT_Item_NegatronCloak' },
  belt: { name: "Giant's Belt", image: belt, riotId: 'TFT_Item_GiantsBelt' },
  gloves: { name: 'Sparring Gloves', image: gloves, riotId: 'TFT_Item_SparringGloves' },
  spatula: { name: 'Spatula', image: spatula, riotId: 'TFT_Item_Spatula' },
  fryingPan: { name: 'Frying Pan', image: fryingPan, riotId: 'TFT_Item_FryingPan' },
} as const;

export type TftComponentId = keyof typeof tftComponents;
