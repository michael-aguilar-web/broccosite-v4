import { playableLines, gameEvents, knowledgeState, roundY, graphHeight, type LineId, type Point } from './examples';

// Keep the route geometry separate from the authored game. Only known routes
// participate in layout; adding one redistributes the origins and event junctions.
export function layoutGraph(count: number) {
  const state = knowledgeState(count);
  const candidates = playableLines.filter(line => state.known.includes(line.id));
  const supported = candidates.filter(line => ['ap-a', 'ap-b', 'ap-reroll'].includes(line.id));
  const others = candidates.filter(line => !supported.includes(line));
  const ordered = [...others, ...supported];
  // Equally spaced starting markers keep even twelve short labels readable.
  // Unsupported routes compress into a narrower band as the game develops.
  const startX = new Map<LineId, number>(ordered.map((line, i) => [line.id, ordered.length === 1 ? 650 : 80 + i * 840 / (ordered.length - 1)]));
  const groupX = (id: LineId) => 670 + (supported.findIndex(line => line.id === id) - (supported.length - 1) / 2) * 26;
  const splitX = (id: LineId) => 650 + (supported.findIndex(line => line.id === id) - (supported.length - 1) / 2) * 90;
  const surviving = supported.filter(line => line.id !== 'ap-reroll');
  const lateX = (id: LineId) => 630 + (surviving.findIndex(line => line.id === id) - (surviving.length - 1) / 2) * 26;
  const limited = state.preferred === 'ap-b';
  const routes = ordered.map((line, i) => {
    const x = startX.get(line.id)!;
    const isSupported = supported.includes(line);
    let points: Point[];
    if (isSupported) {
      points = [[x, 40], [x, 112], [groupX(line.id), 164], [groupX(line.id), 376]];
      if (line.id === 'ap-reroll') points.push([splitX(line.id), 424], [splitX(line.id), 448]);
      else {
        // One gentle transition into the stage 3 lanes, without a detour out
        // and back between the closely spaced 3-1 and 3-2 events.
        points.push([lateX(line.id), 436], [lateX(line.id), 664]);
        if (line.id === state.preferred) points.push([630, 720], [630, 844]);
        else points.push([lateX(line.id), 682]);
      }
    } else {
      // Uninvited alternatives stay on the left of the AP inputs and finish
      // before stage 3. Extra artifact/augment lines are real individual routes.
      const lane = others.length === 1 ? 240 : 100 + i * 260 / Math.max(1, others.length - 1);
      points = [[x, 40], [x, 112], [lane, 164], [lane, 232], [lane, 392]];
    }
    return { ...line, points, end: line.id === state.preferred ? 'played' : 'passed', limited: limited && line.id === 'ap-b', isSupported };
  });
  const events = gameEvents.map(event => {
    const y = roundY(event.round);
    const targets = event.targets.filter(target => state.known.includes(target.line));
    const xs = targets.map(target => y <= 376 ? groupX(target.line) : lateX(target.line));
    const left = event.id === 'early-carry';
    return { ...event, y, x: event.kind === 'board' ? 630 : left ? 440 : 915, targets,
      junction: xs.length ? { min: Math.min(...xs), max: Math.max(...xs), side: left ? 'left' : 'right' } : null };
  });
  return { routes, events, state };
}

// Rounded, ordered bends maintain each route's identity without organic curves.
export function routePath(points: Point[]) {
  let path = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    if (x1 === x2) { path += ` V ${y2}`; continue; }
    // A diagonal with small eased ends keeps parallel tracks from overlapping
    // on the horizontal shelves produced by orthogonal elbow routing.
    const dy = y2 - y1;
    path += ` C ${x1} ${y1 + dy * 0.3} ${x2} ${y2 - dy * 0.3} ${x2} ${y2}`;
  }
  return path;
}
const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
export function renderGraph(count: number, icons: Record<string, string>, tooltipId = 'tft-flow-detail') {
  const layout = layoutGraph(count);
  const describe = (id: string, lines: string) => `data-detail="${id}" data-lines="${lines}"`;
  const button = (id: string, lines: string, css: string, style: string, label: string, content: string) => `<button type="button" class="${css}" ${describe(id, lines)} style="${style}" aria-label="${escape(label)}" aria-describedby="${tooltipId}">${content}</button>`;
  let wires = '';
  let nodes = '';
  for (const family of ['AD', 'AP']) {
    const members = layout.routes.filter(line => line.label.startsWith(family));
    if (!members.length) continue;
    const xs = members.map(line => line.points[0][0]);
    const min = Math.min(...xs);
    const max = Math.max(...xs);
    nodes += `<div class="flow-family" style="left:${min / 10}%;width:${(max - min) / 10}%" aria-label="${family} comps"><span>${family}</span></div>`;
  }
  for (const line of layout.routes) {
    const attributes = `${describe(line.id, line.id)} data-line="${line.id}" data-preferred="${line.id === layout.state.preferred}" style="--comp-color:${line.color}"`;
    const segments = line.points.slice(1).map((point, i) => {
      const from = line.points[i];
      const muted = !line.isSupported && from[1] >= 232;
      const strong = line.id === layout.state.preferred && !line.limited && from[1] >= 436;
      const missing = line.limited && from[1] >= 664;
      // Stop the painted path before its terminal marker. A transparent
      // marker wrapper leaves the round SVG cap visible at every ending.
      const endpoint: Point = i === line.points.length - 2
        ? [point[0], point[1] - (line.end === 'played' ? 22 : 10)] : point;
      const d = routePath([from, endpoint]);
      return `<path class="flow-track${muted ? ' is-muted' : ''}${strong ? ' is-strong' : ''}${missing ? ' is-missing' : ''}" d="${d}"/><path class="flow-hit" d="${d}"/>`;
    }).join('');
    wires += `<g class="flow-line" ${attributes}>${segments}</g>`;
    nodes += button(line.id, line.id, 'flow-origin', `--origin-width:${Math.min(12, 78 / Math.max(1, count - 1))}%;left:${line.points[0][0] / 10}%;--comp-color:${line.color}`, line.label, `<span class="flow-comp-number" aria-hidden="true">${line.label.split(' ').at(-1)}</span>`);
    if (line.end === 'passed') {
      const [x, y] = line.points.at(-1)!;
      nodes += button(line.id, line.id, 'flow-stop', `left:${x / 10}%;top:${y / graphHeight * 100}%;--comp-color:${line.color}`, `${line.label}: why this path ends`, '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M 3 3 L 9 9 M 9 3 L 3 9" /></svg>');
    }
  }
  // One input wire and a shared station for every event, rather than overlapping
  // one horizontal wire per target. Routes remain distinct inside the station.
  for (const event of layout.events) {
    if (event.junction) {
      const { min, max, side } = event.junction;
      const edge = side === 'left' ? min - 8 : max + 8;
      const ids = event.targets.map(target => target.line).join(' ');
      wires += `<g class="flow-inputs" data-detail="${event.id}" data-event-wires="${event.id}" data-lines="${ids}"><path class="flow-input" d="M ${event.x} ${event.y} H ${edge}"/><rect class="flow-station" x="${min - 8}" y="${event.y - 6}" width="${max - min + 16}" height="12" rx="6"/></g>`;
    }
    const isEnd = event.kind === 'board';
    const glyph = { augment: '✦', unit: '4', roll: '8', board: layout.state.preferred === 'ap-b' ? '?' : '✓', conditional: '', items: '' }[event.kind];
    const art = event.items?.map(id => `<img src="${escape(icons[id])}" width="30" height="30" alt="" loading="lazy" decoding="async"/>`).join('') ?? `<span class="flow-glyph flow-glyph--${event.kind}"${isEnd ? ' data-end-glyph' : ''}>${glyph}</span>`;
    nodes += button(event.id, isEnd ? layout.state.preferred : event.lines.join(' '), `flow-event flow-event--${event.kind}`, `left:${event.x / 10}%;top:${event.y / graphHeight * 100}%`, `${event.context}: ${event.title}`, `<span class="flow-event-art" aria-hidden="true">${art}</span><span class="flow-event-label">${isEnd ? layout.state.endLabel : event.label}</span>`);
  }
  return `<svg class="flow-wires" viewBox="0 0 1000 ${graphHeight}" preserveAspectRatio="none" aria-hidden="true">${wires}</svg>${nodes}`;
}
