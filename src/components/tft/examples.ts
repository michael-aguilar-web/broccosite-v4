import type { TftComponentId } from './components';

// A single authored game, not rules or probabilities. The numbered comps are deliberately
// generic comps: both AP four-cost lines can use this example's items.
// Coordinates use percentages horizontally and a shared round scale vertically.
export type LineId = 'ad-a' | 'ad-b' | 'ad-reroll' | 'ap-a' | 'ap-b' | 'ap-reroll' | 'conditional' | 'ad-4' | 'ad-5' | 'ad-6' | 'ap-4' | 'ap-5' | 'ap-6';
export type Point = [number, number];
export interface Detail {
  id: string;
  title: string;
  context: string;
  body: string;
  board?: string;
  note?: string;
  lines: LineId[];
}
export interface CompLine extends Detail {
  id: LineId;
  label: string;
  color: string;
  points: Point[];
  knownAt: number;
  fadesAfter?: number;
  strongAfter?: number;
  end: 'passed' | 'played' | 'conditional';
}
export interface GameEvent extends Detail {
  x: number;
  round: string;
  label: string;
  kind: 'items' | 'augment' | 'unit' | 'roll' | 'conditional' | 'board';
  items?: TftComponentId[];
  targets: { line: LineId; x: number }[];
}

export const rounds = [
  ...Array.from({ length: 4 }, (_, i) => ({ label: `1-${i + 1}`, y: 100 + i * 24 })),
  ...[2, 3, 4].flatMap((stage) => Array.from({ length: 7 }, (_, i) => ({ label: `${stage}-${i + 1}`, y: 232 + (stage - 2) * 204 + i * 24 }))),
  { label: '5-1', y: 844 },
];
export const roundY = (round: string) => {
  const found = rounds.find((entry) => entry.label === round);
  if (!found) throw new Error(`Unknown TFT round: ${round}`);
  return found.y;
};
export const graphHeight = 912;
export const phases = [
  { label: 'stage 1', y: 74 },
  { label: 'stage 2', y: 206 },
  { label: 'stage 3', y: 410 },
  { label: 'stage 4', y: 614 },
  { label: 'stage 5', y: 818 },
];

export const compLines: CompLine[] = [
  {
    id: 'ad-a', knownAt: 2, label: 'AD Comp 1', color: '#ba632c', context: 'Line · four-cost AD carry',
    title: 'AD Comp 1', body: 'One of the AD comps you know. It starts available, but the AP items and augment support make it less attractive. By stage 3, this game has not supplied a reason to pursue it.',
    lines: ['ad-a'], points: [[18, 40], [18, 172], [18, 232], [18, 376], [18, 460]], fadesAfter: 232, end: 'passed',
  },
  {
    id: 'ad-b', knownAt: 3, label: 'AD Comp 2', color: '#ba8a22', context: 'Line · four-cost AD carry',
    title: 'AD Comp 2', body: 'A different four-cost AD comp, with its own board variations. Knowing this line gives you another option, but your items and augment support develop toward AP in this example.',
    lines: ['ad-b'], points: [[31, 40], [31, 172], [31, 232], [31, 376], [31, 460]], fadesAfter: 232, end: 'passed',
  },
  {
    id: 'ad-reroll', knownAt: 6, label: 'AD Comp 3', color: '#ce7966', context: 'Line · low-cost AD carry',
    title: 'AD Comp 3', body: 'A low-cost AD line built around three-starring its carry. Neither the copies nor the item direction invite it in this game, so it falls away as you build toward a four-cost board.',
    lines: ['ad-reroll'], points: [[44, 40], [44, 172], [44, 232], [44, 376], [44, 460]], fadesAfter: 232, end: 'passed',
  },
  {
    id: 'ap-a', knownAt: 4, label: 'AP Comp 1', color: '#357ec1', context: 'Line · four-cost AP carry',
    title: 'AP Comp 1', body: 'This hand can build the preferred items for this four-cost AP line, and the augment is one of its preferred options. An early carry hit makes it the front-runner in stage 3. It becomes the comp you finish only when the stage 4 rolldown supplies the upgrades and supporting board.',
    lines: ['ap-a'], points: [[57, 40], [57, 172], [57, 232], [57, 376], [57, 436], [57, 460], [57, 568], [57, 640], [57, 664], [57, 736], [57, 844]], strongAfter: 436, end: 'played',
  },
  {
    id: 'ap-b', knownAt: 1, label: 'AP Comp 2', color: '#8964b1', context: 'Line · another four-cost AP carry',
    title: 'AP Comp 2', body: 'Another AP comp that can use these items and augments, though they are not its ideal setup. Finding the AP Comp 1 carry early does not rule this one out. Keep it open through stage 3; the actual level 8 rolldown is what settles the board in this example.',
    lines: ['ap-b'], points: [[70, 40], [70, 172], [70, 232], [70, 376], [70, 436], [70, 460], [70, 568], [70, 640], [70, 664], [70, 844]], end: 'passed',
  },
  {
    id: 'ap-reroll', knownAt: 5, label: 'AP Comp 3', color: '#348f89', context: 'Line · low-cost AP carry',
    title: 'AP Comp 3', body: 'The AP item direction leaves this line conceivable early. But this example never supplies the copies or special invitation it needs. By stage 3, your board and economy support continuing toward four-cost carries.',
    note: 'Copies alone are not a universal green light. The patch, an enabling item or augment, and how well you know the comp can all change the decision.',
    lines: ['ap-reroll'], points: [[83, 40], [83, 172], [83, 232], [83, 376], [83, 436], [83, 460]], end: 'passed',
  },

];

export const gameEvents: GameEvent[] = [
  {
    id: 'components', round: '1-4', x: 8, kind: 'items', items: ['rod', 'tear', 'belt'], label: 'starting items',
    context: '1-4 · PvE items', title: 'An opening hand, not a final comp',
    body: 'Rod, tear, and belt leave room for several AP boards. You still need to consider the units and your first augment choices before giving the game a direction.',
    board: 'Pick up pairs and useful opening units during PvE.',
    lines: ['ap-a', 'ap-b', 'ap-reroll'], targets: [{ line: 'ap-a', x: 57 }, { line: 'ap-b', x: 70 }, { line: 'ap-reroll', x: 83 }],
  },
  {
    id: 'first-augment', round: '2-1', x: 92, kind: 'augment', label: 'AP augment',
    context: '2-1 · First augment', title: 'AP direction; several comps open',
    body: 'An augment option supports several AP boards. Together with the components, this gives you two strong signals under the 2/3 rule. It favors the AP family without selecting a particular carry.',
    board: 'Useful frontline and a temporary AP item holder. Your opening units do not need to belong to the final comp.',
    lines: ['ap-a', 'ap-b', 'ap-reroll'], targets: [{ line: 'ap-a', x: 57 }, { line: 'ap-b', x: 70 }, { line: 'ap-reroll', x: 83 }],
  },
  {
    id: 'first-carousel', round: '2-4', x: 8, kind: 'items', items: ['tear'], label: 'carousel',
    context: '2-4 · Carousel', title: 'Items shared by several AP lines',
    body: 'Another tear continues the AP item direction. In this authored example, both four-cost AP comps can use the developing items, so the carousel does not decide between them.',
    board: 'Keep playing the strongest temporary board you can make.',
    lines: ['ap-a', 'ap-b', 'ap-reroll'], targets: [{ line: 'ap-a', x: 57 }, { line: 'ap-b', x: 70 }, { line: 'ap-reroll', x: 83 }],
  },
  {
    id: 'krugs', round: '2-7', x: 8, kind: 'items', items: ['rod', 'gloves'], label: 'PvE items',
    context: '2-7 · More components', title: 'The AP direction gets stronger',
    body: 'More AP-friendly components reinforce the family you are playing toward. The AD lines have less and less support, but the remaining AP comps still share useful parts of this hand.',
    lines: ['ap-a', 'ap-b', 'ap-reroll'], targets: [{ line: 'ap-a', x: 57 }, { line: 'ap-b', x: 70 }, { line: 'ap-reroll', x: 83 }],
  },
  {
    id: 'early-carry', round: '3-1', x: 92, kind: 'unit', label: 'early 4-cost',
    context: '3-1 · Natural shop hit', title: 'A strong signal, not a lock-in',
    body: 'You find the four-cost carry for AP Comp 1 early. It makes that line more attractive and can strengthen your current board. AP Comp 2 remains viable: the items still fit, and you have not seen the stage 4 rolldown yet.',
    board: 'Field the early four-cost AP carry with the useful frontline and support units you already have.',
    lines: ['ap-a', 'ap-b'], targets: [{ line: 'ap-a', x: 57 }],
  },
  {
    id: 'second-augment', round: '3-2', x: 8, kind: 'augment', label: 'combat augment',
    context: '3-2 · Second augment', title: 'Two four-cost lines remain',
    body: 'A broadly useful combat augment works for both AP boards. You have no reroll invitation in this game, so keep building toward level 8. The early AP Comp 1 hit gives it an edge, while AP Comp 2 stays open.',
    board: 'An AP carry, frontline, and supporting units. Improve the board without needing every final piece.',
    lines: ['ap-a', 'ap-b'], targets: [{ line: 'ap-a', x: 57 }, { line: 'ap-b', x: 70 }],
  },
  {
    id: 'second-carousel', round: '3-4', x: 92, kind: 'items', items: ['vest'], label: 'carousel',
    context: '3-4 · Carousel', title: 'Frontline items keep both paths open',
    body: 'A useful frontline component supports either AP board. Not every input narrows the choices; some simply make the current position stronger.',
    board: 'Keep the strongest units available while saving toward the level 8 rolldown.',
    note: 'If the board is too weak, a light level 7 rolldown can help stabilize without necessarily changing the intended comp.',
    lines: ['ap-a', 'ap-b'], targets: [{ line: 'ap-a', x: 57 }, { line: 'ap-b', x: 70 }],
  },
  {
    id: 'rolldown', round: '4-2', x: 8, kind: 'roll', label: 'level 8 roll',
    context: '4-2 · Level 8 rolldown', title: 'The hits settle the comp',
    body: 'The rolldown supplies the AP Comp 1 carry upgrade and a compatible frontline and supporting board. This is where the possibilities converge into the comp you actually finish.',
    board: 'Two-star four-cost AP Comp 1 carry, upgraded frontline, and compatible support units. Transfer the items as needed.',
    note: 'This example rolls at 4-2. The level 8 rolldown is often at 4-2 or 4-5, depending on the spot.',
    lines: ['ap-a', 'ap-b'], targets: [{ line: 'ap-a', x: 57 }, { line: 'ap-b', x: 70 }],
  },
  {
    id: 'endgame', round: '5-1', x: 57, kind: 'board', label: 'AP Comp 1',
    context: '5-1 · End game', title: 'One comp, still room to improve',
    body: 'Your item direction, augments, and unit hits led to this board. Continue refining the supporting units, upgrades, and remaining items around the lobby.',
    board: 'The AP Comp 1 core and the strongest compatible variation you found.',
    lines: ['ap-a'], targets: [],
  },
];



// Lines are added individually to an authored repertoire; the game stays fixed.
export type KnowledgeCount = number;
export const otherLines: CompLine[] = [
  { id: 'ad-4', knownAt: 7, label: 'AD Comp 4', title: 'AD Comp 4', color: '#bd6a40', context: 'Additional line · different item profile', body: 'This AD line needs a physical damage item setup that these drops do not provide.', lines: ['ad-4'], points: [[84, 328], [84, 376]], end: 'conditional' },
  { id: 'ad-5', knownAt: 8, label: 'AD Comp 5', title: 'AD Comp 5', color: '#aa842a', context: 'Additional line · artifact-enabled', body: 'You know how to play this AD line, but its enabling artifact does not appear in this game.', lines: ['ad-5'], points: [[87, 328], [87, 376]], end: 'conditional' },
  { id: 'ad-6', knownAt: 9, label: 'AD Comp 6', title: 'AD Comp 6', color: '#ba7462', context: 'Additional line · augment-enabled', body: 'This AD line requires a specific augment that is not offered in this example.', lines: ['ad-6'], points: [[90, 328], [90, 376]], end: 'conditional' },
  { id: 'ap-4', knownAt: 10, label: 'AP Comp 4', title: 'AP Comp 4', color: '#4683ba', context: 'Additional line · different item profile', body: 'This AP line needs a different item profile. Sharing AP damage does not make these drops a good fit for it.', lines: ['ap-4'], points: [[93, 328], [93, 376]], end: 'conditional' },
  { id: 'ap-5', knownAt: 11, label: 'AP Comp 5', title: 'AP Comp 5', color: '#8a6aad', context: 'Additional line · artifact-enabled', body: 'The artifact that enables this AP line is absent. Knowing the line does not create its missing enabler.', lines: ['ap-5'], points: [[96, 328], [96, 376]], end: 'conditional' },
  { id: 'ap-6', knownAt: 12, label: 'AP Comp 6', title: 'AP Comp 6', color: '#408f86', context: 'Additional line · augment-enabled', body: 'This AP line needs a specific augment. The generic AP and combat augments in this game do not enable it.', lines: ['ap-6'], points: [[99, 328], [99, 376]], end: 'conditional' },
];
export const playableLines = [...compLines, ...otherLines];
export function knowsLine(id: string, count: KnowledgeCount) {
  return playableLines.some(line => line.id === id && line.knownAt <= count);
}
export function knowledgeState(count: KnowledgeCount) {
  const limited = !knowsLine('ap-a', count);
  return {
    count,
    known: playableLines.filter(line => knowsLine(line.id, count)).map(line => line.id),
    preferred: (limited ? 'ap-b' : 'ap-a') as LineId,
    endX: compLines.find(line => line.id === (limited ? 'ap-b' : 'ap-a'))!.points[0][0],
    endLabel: limited ? 'needs carry' : 'AP Comp 1',
    status: limited ? 'AP Comp 2 · more pieces needed'
      : 'AP Comp 1 · the hand fits this line',
  };
}

const limitedDetails: Record<string, Partial<Detail>> = {
  'ap-b': {
    body: 'This is the only four-cost AP line in this repertoire. The components and augments are usable, but not its best setup. You can play toward it, though the fixed shops do not supply its key carry. That requires more steering than recognizing AP Comp 1.',
    note: 'The dashed continuation shows pieces you would still need to find. It does not add any new drops or guarantee you will hit them.',
  },
  components: { title: 'An AP hand; one familiar option', body: 'Rod, tear, and belt point toward AP. You know AP Comp 2 well enough to play toward it, but do not yet recognize the stronger fit for AP Comp 1. Adding that line reveals another route through the same drops.' },
  'first-augment': { title: 'Usable support for the line you know', body: 'The same AP augment is available at every slider setting. It is usable for AP Comp 2, while being one of the preferred options for AP Comp 1. Recognizing that distinction requires knowing both lines.' },
  'first-carousel': { body: 'Another tear is usable in the AP line you know. It also builds toward the preferred items of AP Comp 1, but that full sequence is outside your current repertoire.' },
  krugs: { body: 'These components continue to favor AP. With only AP Comp 2 familiar, you are still trying to fit this hand into that line. With more knowledge, the same items would point more directly toward AP Comp 1.' },
  'early-carry': {
    title: 'A useful unit; an unfamiliar line',
    body: 'You can recognize the four-cost AP unit as a strong item holder without knowing the full AP Comp 1 line. The shops have handed you its carry, but you still need the carry for the AP Comp 2 sequence you know.',
    board: 'Use the early four-cost as a temporary carry with your current frontline. Knowing its final board alone would not explain the whole route.',
  },
  'second-augment': { title: 'Still working toward AP Comp 2', body: 'The combat augment is broadly useful, but it does not solve the missing pieces of your familiar line. AP Comp 1 now has the item fit, augment support, and a natural carry hit; its full route is still unfamiliar.', board: 'A strong temporary AP carry and frontline, while you keep looking for the AP Comp 2 core.' },
  'second-carousel': { body: 'The vest improves frontline options for either comp. This helps your current board but does not supply the carry that your familiar AP line needs.' },
  rolldown: {
    title: 'The shops favor another line',
    body: 'The fixed rolldown contains AP Comp 1 upgrades and supporting units. You can strengthen the temporary board, but completing AP Comp 2 still requires pieces these shops have not supplied. More knowledge would let you recognize and execute the route already available.',
    board: 'Use the AP upgrades you hit while still needing the carry for AP Comp 2.',
  },
  endgame: {
    title: 'More pieces still needed',
    body: 'AP Comp 2 is the familiar destination, but this hand has not supplied its core. The dashed route represents that remaining requirement, not a predicted placement or extra rolls. Increase the known lines to see the better match already present in the same drops.',
    board: 'A usable temporary AP board; the familiar comp is not complete.',
    lines: ['ap-b'],
  },
};

export const details: Detail[] = [...compLines, ...otherLines, ...gameEvents];
export function detailFor(id: string, count: KnowledgeCount): Detail | undefined {
  const original = details.find(detail => detail.id === id);
  if (!original) return undefined;
  const line = playableLines.find(line => line.id === id);
  if (line && !knowsLine(id, count)) return {
    ...original,
    context: 'Unfamiliar line · outside this repertoire',
    body: `You do not know the full ${line.label} sequence at this setting: its preferred items and augments, useful unit timing, and transitions. ${original.body}`,
    note: 'Increase “lines you know” to reveal the connections you would recognize. The game’s drops stay the same.',
  };
  const detail = !knowsLine('ap-a', count) ? { ...original, ...limitedDetails[id] } : original;
  return { ...detail, lines: detail.lines.filter(id => knowsLine(id, count)) };
}
