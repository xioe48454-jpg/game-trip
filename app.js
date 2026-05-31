const gameArea = document.querySelector("#gameArea");
const menu = document.querySelector("#gameMenu");
const title = document.querySelector("#gameTitle");
const kicker = document.querySelector("#gameKicker");
const message = document.querySelector("#message");
const scoreBox = document.querySelector("#scoreBox");
const resetBtn = document.querySelector("#resetBtn");
const helpBtn = document.querySelector("#helpBtn");
const helpDialog = document.querySelector("#helpDialog");
const closeHelpBtn = document.querySelector("#closeHelpBtn");
const helpTitle = document.querySelector("#helpTitle");
const helpText = document.querySelector("#helpText");
const difficultyPanel = document.querySelector("#difficultyPanel");
const characterPicker = document.querySelector("#characterPicker");
const drawer = document.querySelector("#drawer");
const menuToggle = document.querySelector("#menuToggle");
const scrim = document.querySelector("#scrim");
const backBtn = document.querySelector("#backBtn");
const settingsToggle = document.querySelector("#settingsToggle");
const difficultyToggle = document.querySelector("#difficultyToggle");

let activeGame = null;
let cleanup = () => {};
let currentCharacter = "kitty";
let gameStarted = false;
const settings = {};
let records = {};
try { records = JSON.parse(localStorage.getItem("gameKittyRecords") || "{}"); } catch(e) {}

const characters = [
  { id: "kitty", name: "\u51ef\u8482\u732b", color: "#ff7db7", accent: "#e9418b", img: "https://corporate.sanrio.co.jp/en/business-info/images/img_hello-kitty.png" },
  { id: "melody", name: "\u7f8e\u4e50\u8482", color: "#ff9fcf", accent: "#cf5f9c", img: "https://corporate.sanrio.co.jp/en/business-info/images/img_my-melody.png" },
  { id: "cinnamoroll", name: "\u5927\u8033\u72d7", color: "#89cdf8", accent: "#438cc7", img: "https://corporate.sanrio.co.jp/en/business-info/images/img_cinnamoroll.png" },
  { id: "kuromi", name: "\u9177\u6d1b\u7c73", color: "#8d78c6", accent: "#5b4a9a", img: "https://corporate.sanrio.co.jp/en/business-info/images/img_kuromi.png" },
  { id: "pompom", name: "\u5e03\u4e01\u72d7", color: "#ffd86a", accent: "#d19a1d", img: "https://corporate.sanrio.co.jp/en/business-info/images/img_pompompurin.png" },
  { id: "keroppi", name: "\u5927\u773c\u86d9", color: "#78d6a6", accent: "#2d9b64", img: "https://corporate.sanrio.co.jp/en/business-info/images/img_kerokerokeroppi.png" },
  { id: "pochacco", name: "\u5e15\u6070\u72d7", color: "#7dc7f4", accent: "#438cc7", img: "https://corporate.sanrio.co.jp/en/business-info/images/img_pochacco.png" },
  { id: "hangyodon", name: "\u534a\u9c7c\u4eba", color: "#79d5df", accent: "#3199a9", img: "https://corporate.sanrio.co.jp/en/business-info/images/img_hangyodon.png" },
  { id: "badtz", name: "\u9177\u4f01\u9e45", color: "#4c5265", accent: "#272b36", img: "https://corporate.sanrio.co.jp/en/business-info/images/img_bad-badtz-maru.png" },
  { id: "tuxedosam", name: "\u4f01\u9e45\u5c71\u59c6", color: "#71b9ee", accent: "#2c79b9", img: "https://corporate.sanrio.co.jp/en/business-info/images/img_tuxedosam.png" },
];

const faceImages = new Map(characters.map((char) => {
  const image = new Image();
  image.src = char.img;
  return [char.id, image];
}));

const games = [
  { id: "mines", name: "\u626b\u96f7", tag: "\u63a8\u7406", icon: "\u96f7", help: "\u70b9\u5230\u7a7a\u767d\u683c\u4f1a\u50cf\u7ecf\u5178\u626b\u96f7\u4e00\u6837\u8fde\u5f00\u4e00\u7247\u3002" },
  { id: "gomoku", name: "\u4e94\u5b50\u68cb", tag: "\u7b56\u7565", icon: "\u4e94", help: "\u4f60\u6267\u5f53\u524d\u89d2\u8272\uff0c\u7535\u8111\u6267\u53e6\u4e00\u4e2a\u89d2\u8272\uff0c\u5148\u8fde\u4e94\u5b50\u83b7\u80dc\u3002" },
  { id: "game2048", name: "2048", tag: "\u5408\u6210", icon: "2", help: "\u7535\u8111\u7528\u65b9\u5411\u952e\uff0c\u624b\u673a\u76f4\u63a5\u5728\u68cb\u76d8\u4e0a\u6ed1\u52a8\u3002" },
  { id: "memory", name: "\u8bb0\u5fc6\u7ffb\u724c", tag: "\u8bb0\u5fc6", icon: "\u5361", help: "\u4e00\u6b21\u7ffb\u4e24\u5f20\uff0c\u914d\u5bf9\u6240\u6709\u89d2\u8272\u5361\u3002" },
  { id: "pong", name: "\u4e52\u4e53\u7403", tag: "\u7403\u573a", icon: "\u62cd", help: "\u62d6\u52a8\u4e0b\u65b9\u7403\u62cd\uff0c\u548c\u5bf9\u9762\u7684\u4e09\u4e3d\u9e25\u89d2\u8272\u6253\u4e52\u4e53\u7403\u3002" },
  { id: "breakout", name: "\u6253\u7816\u5757", tag: "\u8857\u673a", icon: "\u7816", help: "\u79fb\u52a8\u7403\u62cd\u53cd\u5f39\u89d2\u8272\u7403\uff0c\u6e05\u6389\u793c\u7269\u7816\u5757\u3002" },
  { id: "snake", name: "\u8d2a\u5403\u86c7", tag: "\u8857\u673a", icon: "\u86c7", help: "\u7528\u65b9\u5411\u952e\u63a7\u5236\u89d2\u8272\u5403\u6389\u98df\u7269\uff0c\u78b0\u5899\u6216\u54ac\u5230\u81ea\u5df1\u5c31\u7ed3\u675f\u3002" },
  { id: "tetris", name: "\u4fc4\u7f57\u65af\u65b9\u5757", tag: "\u8857\u673a", icon: "\u5757", help: "\u65b9\u5757\u4ece\u4e0a\u65b9\u843d\u4e0b\uff0c\u586b\u6ee1\u4e00\u884c\u5373\u53ef\u6d88\u9664\uff0c\u65b9\u5757\u5806\u5230\u9876\u90e8\u6e38\u620f\u7ed3\u675f\u3002" },
  { id: "poker", name: "\u6597\u5730\u4e3b", tag: "\u724c\u5c40", icon: "\u724c", help: "\u53eb\u5730\u4e3b\u540e\u51fa\u5b8c\u624b\u724c\u83b7\u80dc\uff0c\u652f\u6301\u6240\u6709\u6807\u51c6\u724c\u578b\uff0c\u7535\u8111\u63a7\u5236\u53e6\u5916\u4e24\u5bb6\u3002" },
];

const defaults = {
  mines: { size: 12, mines: 20 },
  gomoku: { level: "hard", size: 15 },
  game2048: { start: 2, goal: 2048 },
  memory: { pairs: 8, peek: 0 },
  pong: { speed: 1.2, rival: "melody" },
  breakout: { rows: 5, speed: 1.0 },
  snake: { size: 16, speed: 1.0 },
  tetris: { speed: 1.0 },
  poker: { level: "normal" },
};

games.forEach((game) => {
  settings[game.id] = { ...defaults[game.id] };
});

const rand = (max) => Math.floor(Math.random() * max);
const shuffle = (array) => array.map((value) => [Math.random(), value]).sort((a, b) => a[0] - b[0]).map((item) => item[1]);
const character = () => characters.find((item) => item.id === currentCharacter);
const otherCharacter = () => characters.find((item) => item.id !== currentCharacter);

const setScore = (text) => {
  scoreBox.textContent = text;
};

const setMessage = (text) => {
  message.textContent = text;
};

function recordResult(score, text) {
  const id = activeGame.id;
  records[id] = records[id] || [];
  records[id].unshift({ score, text, time: new Date().toLocaleString() });
  records[id] = records[id].slice(0, 8);
  localStorage.setItem("gameKittyRecords", JSON.stringify(records));
  const best = Math.max(...records[id].map((item) => Number(item.score) || 0));
  setMessage(`${text}｜本局 ${score}｜最佳 ${best}`);
}

function recordHint(id = activeGame.id) {
  const list = records[id] || [];
  if (!list.length) return "";
  return `最佳 ${Math.max(...list.map((item) => Number(item.score) || 0))}`;
}

const closeDrawer = () => {
  if (!gameStarted) return;
  drawer.classList.remove("open");
  scrim.hidden = true;
  document.body.classList.add("game-mode");
  document.body.classList.remove("menu-mode");
};

const openDrawer = () => {
  drawer.classList.add("open");
  scrim.hidden = true;
  document.body.classList.add("menu-mode");
  document.body.classList.remove("game-mode");
};

menuToggle.addEventListener("click", () => drawer.classList.contains("open") && gameStarted ? closeDrawer() : openDrawer());
scrim.addEventListener("click", closeDrawer);
backBtn.addEventListener("click", openDrawer);
settingsToggle.addEventListener("click", () => {
  document.body.classList.toggle("characters-open");
  document.body.classList.remove("difficulty-open");
});
difficultyToggle.addEventListener("click", () => {
  document.body.classList.toggle("difficulty-open");
  document.body.classList.remove("characters-open");
});

function clearGame() {
  cleanup();
  cleanup = () => {};
  gameArea.innerHTML = "";
  scoreBox.classList.remove("score-danger");
  gameArea.focus();
}

function bindKey(handler) {
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}

function badge(char = character(), className = "player-symbol") {
  return `<span class="${className}" style="background:${char.color};box-shadow:inset 0 -3px 0 ${char.accent}"><img class="face" src="${char.img}" alt="${char.name}" style="width:min(100%, 100%);height:auto;aspect-ratio:1 / 1;object-fit:contain;display:block;max-width:85%;max-height:85%" onerror="this.style.display='none'"></span>`;
}

function renderCharacters() {
  characterPicker.innerHTML = characters.map((char) => `
    <button class="character-button ${char.id === currentCharacter ? "active" : ""}" type="button" data-character="${char.id}">
      <span class="avatar" style="background:${char.color};box-shadow:inset 0 -3px 0 ${char.accent}"><img class="face" src="${char.img}" alt="${char.name}" onerror="this.style.display='none'"></span>
      <span>${char.name}</span>
    </button>
  `).join("");
}

function renderMenu() {
  menu.innerHTML = games.map((game) => `
    <button class="menu-button" type="button" data-game="${game.id}">
      <span class="menu-icon">${badge(characters[games.indexOf(game) % characters.length], "menu-face")}</span>
      <span class="menu-name">${game.name}</span>
      <span class="menu-tag">${game.tag}</span>
    </button>
  `).join("");
}

function numberField(label, key, min, max, step = 1) {
  return `<div class="field-row"><label>${label}</label><input data-setting="${key}" type="number" min="${min}" max="${max}" step="${step}" value="${settings[activeGame.id][key]}"></div>`;
}

function rangeField(label, key, min, max, step = 0.1, suffix = "x") {
  return `<div class="field-row"><label>${label}</label><input data-setting="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${settings[activeGame.id][key]}"><strong id="${key}Value">${settings[activeGame.id][key]}${suffix}</strong></div>`;
}

function selectField(label, key, options) {
  return `<div class="field-row"><label>${label}</label><select data-setting="${key}">${options.map(([value, text]) => `<option value="${value}" ${settings[activeGame.id][key] == value ? "selected" : ""}>${text}</option>`).join("")}</select></div>`;
}

function characterSelectField(label, key) {
  const options = characters
    .filter((char) => char.id !== currentCharacter)
    .map((char) => [char.id, char.name]);
  return selectField(label, key, options);
}

function renderDifficulty() {
  const id = activeGame.id;
  const panels = {
    mines: () => numberField("\u68cb\u76d8", "size", 9, 30) + numberField("\u96f7\u6570", "mines", 1, 500),
    gomoku: () => selectField("\u96be\u5ea6", "level", [["easy", "\u8f7b\u677e"], ["normal", "\u666e\u901a"], ["hard", "\u56f0\u96be"]]) + numberField("\u68cb\u76d8", "size", 11, 19),
    game2048: () => numberField("\u5f00\u5c40", "start", 2, 6) + selectField("\u76ee\u6807", "goal", [[512, "512"], [1024, "1024"], [2048, "2048"], [4096, "4096"]]),
    memory: () => numberField("\u5bf9\u5b50", "pairs", 4, 18) + selectField("\u9884\u89c8", "peek", [[0, "\u5173\u95ed"], [2, "2 \u79d2"], [4, "4 \u79d2"]]),
    pong: () => rangeField("\u901f\u5ea6", "speed", 0.8, 3, 0.2) + characterSelectField("\u5bf9\u624b", "rival"),
    breakout: () => numberField("\u884c\u6570", "rows", 3, 10) + rangeField("\u901f\u5ea6", "speed", 0.8, 2.5, 0.1),
    snake: () => numberField("\u68cb\u76d8", "size", 12, 25) + rangeField("\u901f\u5ea6", "speed", 0.8, 3, 0.2),
    tetris: () => rangeField("\u901f\u5ea6", "speed", 0.5, 3, 0.5),
    poker: () => selectField("AI\u96be\u5ea6", "level", [["easy", "\u7b80\u5355"], ["normal", "\u666e\u901a"], ["hard", "\u56f0\u96be"]]),
  };
  difficultyPanel.innerHTML = panels[id]();
}

function loadGame(id) {
  const game = games.find((item) => item.id === id);
  activeGame = game;
  document.body.dataset.game = id;
  gameArea.style.opacity = "0";
  clearGame();
  title.textContent = game.name;
  kicker.textContent = `${game.tag.toUpperCase()} · ${character().name}`;
  document.querySelectorAll(".menu-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.game === id);
  });
  setScore("分数 0");
  setMessage(recordHint(id) || "");
  renderDifficulty();
  document.body.classList.remove("characters-open", "difficulty-open");
  gameStarted = true;
  closeDrawer();
  gameRunners[id]();
  gameArea.style.opacity = "1";
}

menu.addEventListener("click", (event) => {
  const button = event.target.closest("[data-game]");
  if (button) loadGame(button.dataset.game);
});

characterPicker.addEventListener("click", (event) => {
  const button = event.target.closest("[data-character]");
  if (!button) return;
  currentCharacter = button.dataset.character;
  renderCharacters();
  loadGame(activeGame.id);
});

difficultyPanel.addEventListener("input", (event) => {
  const input = event.target.closest("[data-setting]");
  if (!input) return;
  const value = input.type === "number" || input.type === "range" ? Number(input.value) : input.value;
  settings[activeGame.id][input.dataset.setting] = value;
  const label = document.querySelector(`#${input.dataset.setting}Value`);
  if (label) label.textContent = `${value}x`;
});

difficultyPanel.addEventListener("change", () => loadGame(activeGame.id));
resetBtn.addEventListener("click", () => loadGame(activeGame.id));
helpBtn.addEventListener("click", () => {
  helpTitle.textContent = `${activeGame.name}玩法`;
  helpText.textContent = activeGame.help;
  helpDialog.hidden = false;
});
closeHelpBtn.addEventListener("click", () => helpDialog.hidden = true);

function makeBoard(rows, cols, extraClass = "") {
  const board = document.createElement("div");
  board.className = `board ${extraClass}`;
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  gameArea.append(board);
  return board;
}

function runMines() {
  document.querySelectorAll(".zoom-bar").forEach((bar) => bar.remove());
  const size = Math.max(9, Math.min(30, settings.mines.size));
  const total = size * size;
  const mineCount = Math.max(1, Math.min(500, total - 1, settings.mines.mines));
  settings.mines.mines = mineCount;
  const mines = new Set();
  while (mines.size < mineCount) mines.add(rand(total));
  const revealed = new Set();
  const flagged = new Set();
  const clickTimers = new Map();
  const hint = document.createElement("p");
  hint.className = "mines-hint";
  hint.textContent = "\u5355\u51fb\u7ffb\u5f00 \u00b7 \u53cc\u51fb\u63d2\u65d7";
  gameArea.append(hint);
  const board = makeBoard(size, size);
  const zoomBar = document.createElement("div");
  zoomBar.className = "zoom-bar";
  zoomBar.innerHTML = '<button class="small-button" type="button" data-zoom="-1">-</button><button class="small-button" type="button" data-zoom="1">+</button>';
  document.body.append(zoomBar);
  let cellSize = size > 22 ? 28 : 36;
  const updateCellSizes = () => {
    cells.forEach((cell) => cell.style.width = cell.style.height = `${cellSize}px`);
  };
  zoomBar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-zoom]");
    if (!button) return;
    cellSize = Math.max(20, Math.min(58, cellSize + Number(button.dataset.zoom) * 4));
    updateCellSizes();
  });
  cleanup = () => {
    zoomBar.remove();
    clickTimers.forEach((timer) => clearTimeout(timer));
  };
  const char = character();
  const updateRemainingMines = () => {
    const remaining = mineCount - flagged.size;
    setScore(`\ud83d\udca3 ${remaining}`);
    scoreBox.classList.toggle("score-danger", remaining === 0);
  };
  updateRemainingMines();
  setMessage(`避开 ${char.name} 徽章雷，翻开 ${total - mineCount} 个安全格。`);

  const countNear = (index) => {
    const r = Math.floor(index / size);
    const c = index % size;
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && mines.has(nr * size + nc)) count++;
      }
    }
    return count;
  };

  const cells = Array.from({ length: total }, (_, index) => {
    const cell = document.createElement("button");
    cell.className = "cell";
    cell.type = "button";
    cell.style.width = cell.style.height = `${cellSize}px`;
    const toggleFlag = () => {
      if (revealed.has(index)) return;
      if (flagged.has(index)) {
        flagged.delete(index);
        cell.classList.remove("flagged");
        cell.innerHTML = "";
      } else {
        flagged.add(index);
        cell.classList.add("flagged");
        cell.innerHTML = '<span class="cute-flag" aria-label="\u6807\u8bb0\u6709\u96f7">\ud83c\udf80</span>';
        hint.hidden = true;
      }
      updateRemainingMines();
    };
    const reveal = () => {
      if (revealed.has(index) || flagged.has(index)) return;
      if (mines.has(index)) {
        cell.innerHTML = badge(char, "mine-symbol");
        cell.classList.add("hit");
        setMessage("踩中角色雷了，按重开换一局。");
        recordResult(revealed.size, "踩雷了");
        cells.forEach((item, i) => {
          if (mines.has(i)) item.innerHTML = badge(char, "mine-symbol");
          item.disabled = true;
        });
        return;
      }
      const revealFrom = (start) => {
        const queue = [start];
        while (queue.length) {
          const current = queue.shift();
          if (revealed.has(current) || flagged.has(current) || mines.has(current)) continue;
          revealed.add(current);
          const currentCell = cells[current];
          const near = countNear(current);
          currentCell.classList.add("revealed");
          currentCell.textContent = near || "";
          if (near) continue;
          currentCell.classList.add("empty");
          const r = Math.floor(current / size);
          const c = current % size;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              const next = nr * size + nc;
              if (nr >= 0 && nr < size && nc >= 0 && nc < size && !revealed.has(next)) queue.push(next);
            }
          }
        }
      };
      revealFrom(index);
      updateRemainingMines();
      if (revealed.size === total - mineCount) recordResult(revealed.size, "清空成功");
    };
    cell.addEventListener("click", () => {
      if (revealed.has(index)) return;
      const timer = clickTimers.get(index);
      if (timer) {
        clearTimeout(timer);
        clickTimers.delete(index);
        toggleFlag();
        return;
      }
      clickTimers.set(index, setTimeout(() => {
        clickTimers.delete(index);
        reveal();
      }, 220));
    });
    board.append(cell);
    return cell;
  });
}

function runGomoku() {
  document.querySelectorAll(".zoom-bar").forEach((bar) => bar.remove());
  const size = Math.max(11, Math.min(19, settings.gomoku.size));
  const board = makeBoard(size, size, "gomoku-board");
  board.style.setProperty("--gomoku-size", size);
  const zoomBar = document.createElement("div");
  zoomBar.className = "zoom-bar";
  zoomBar.innerHTML = '<button class="small-button" type="button" data-zoom="-1">-</button><button class="small-button" type="button" data-zoom="1">+</button>';
  document.body.append(zoomBar);
  let cellSize = size > 15 ? 28 : 32;
  const state = Array(size * size).fill("");
  let over = false;
  let aiThinking = false;
  let aiTimer = null;
  const player = character();
  const cpu = otherCharacter();
  const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];
  const indexOf = (x, y) => y * size + x;
  const inBoard = (x, y) => x >= 0 && x < size && y >= 0 && y < size;
  const at = (x, y) => inBoard(x, y) ? state[indexOf(x, y)] : null;

  const lineFor = (x, y, mark, dx, dy) => {
    let count = 1;
    const line = [indexOf(x, y)];
    for (const dir of [1, -1]) {
      let nx = x + dx * dir;
      let ny = y + dy * dir;
      while (at(nx, ny) === mark) {
        count++;
        line.push(indexOf(nx, ny));
        nx += dx * dir;
        ny += dy * dir;
      }
    }
    return count >= 5 ? line : null;
  };

  const winningLine = (x, y, mark) => {
    for (const [dx, dy] of dirs) {
      const line = lineFor(x, y, mark, dx, dy);
      if (line) return line;
    }
    return null;
  };

  const scoreMove = (index, mark) => {
    const x = index % size;
    const y = Math.floor(index / size);
    let best = 0;
    for (const [dx, dy] of dirs) {
      let count = 1;
      let open = 0;
      for (const dir of [1, -1]) {
        let nx = x + dx * dir;
        let ny = y + dy * dir;
        while (at(nx, ny) === mark) {
          count++;
          nx += dx * dir;
          ny += dy * dir;
        }
        if (at(nx, ny) === "") open++;
      }
      best = Math.max(best, count * count * 12 + open * 8);
    }
    return best;
  };

  const candidateMoves = () => {
    const stones = state.map((mark, index) => mark ? index : null).filter((index) => index !== null);
    if (!stones.length) return [indexOf(Math.floor(size / 2), Math.floor(size / 2))];
    const candidates = new Set();
    stones.forEach((stone) => {
      const sx = stone % size;
      const sy = Math.floor(stone / size);
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const x = sx + dx;
          const y = sy + dy;
          const index = indexOf(x, y);
          if (inBoard(x, y) && !state[index]) candidates.add(index);
        }
      }
    });
    return [...candidates];
  };

  const bestMove = () => {
    const candidates = candidateMoves();
    if (settings.gomoku.level === "easy") return candidates[rand(candidates.length)];
    for (const mark of ["O", "X"]) {
      const move = candidates.find((index) => {
        state[index] = mark;
        const line = winningLine(index % size, Math.floor(index / size), mark);
        state[index] = "";
        return line;
      });
      if (move !== undefined) return move;
    }
    return candidates
      .map((index) => ({
        index,
        score: scoreMove(index, "O") + (settings.gomoku.level === "hard" ? scoreMove(index, "X") * 0.9 : scoreMove(index, "X") * 0.45),
      }))
      .sort((a, b) => b.score - a.score)[0].index;
  };

  const end = (text, line) => {
    over = true;
    setMessage(text);
    line.forEach((index) => cells[index].classList.add("hit"));
    recordResult(text.includes(player.name) ? 100 : 0, text);
  };

  const place = (index, mark, char) => {
    state[index] = mark;
    cells[index].innerHTML = badge(char);
    cells[index].classList.add("revealed");
    const line = winningLine(index % size, Math.floor(index / size), mark);
    if (line) end(`${char.name} 连成五子。`, line);
  };

  const cells = state.map((_, index) => {
    const cell = document.createElement("button");
    cell.className = "cell";
    cell.type = "button";
    cell.style.width = cell.style.height = `${cellSize}px`;
    cell.addEventListener("click", () => {
      if (state[index] || over || aiThinking) return;
      place(index, "X", player);
      if (over) return;
      if (!state.some((mark) => !mark)) {
        over = true;
        recordResult(50, "棋盘下满，平局。");
        return;
      }
      aiThinking = true;
      setMessage("\u5bf9\u65b9\u601d\u8003\u4e2d\u2026");
      aiTimer = setTimeout(() => {
        aiTimer = null;
        if (over) return;
        const move = bestMove();
        place(move, "O", cpu);
        aiThinking = false;
        if (!over) setMessage(`\u4f60\u662f ${player.name}\uff0c\u4e94\u5b50\u8fde\u7ebf\u83b7\u80dc\u3002\u7535\u8111\u96be\u5ea6\uff1a${settings.gomoku.level}\u3002`);
      }, 600);
    });
    board.append(cell);
    return cell;
  });
  setMessage(`你是 ${player.name}，五子连线获胜。电脑难度：${settings.gomoku.level}。`);
  zoomBar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-zoom]");
    if (!button) return;
    cellSize = Math.max(22, Math.min(56, cellSize + Number(button.dataset.zoom) * 4));
    cells.forEach((cell) => cell.style.width = cell.style.height = `${cellSize}px`);
  });
  cleanup = () => {
    zoomBar.remove();
    if (aiTimer) clearTimeout(aiTimer);
  };
}

function run2048() {
  const board = makeBoard(4, 4, "game2048-grid");
  const trail = document.createElement("span");
  trail.className = "swipe-trail";
  board.append(trail);
  let grid = Array(16).fill(0);
  let newest = -1;
  let over = false;
  const cells = grid.map(() => {
    const cell = document.createElement("div");
    cell.className = "cell";
    board.append(cell);
    return cell;
  });
  const addTile = () => {
    const empty = grid.map((v, i) => v ? null : i).filter((v) => v !== null);
    if (!empty.length) return;
    newest = empty[rand(empty.length)];
    grid[newest] = Math.random() < 0.9 ? 2 : 4;
  };
  const draw = (mergedTargets = new Set()) => {
    cells.forEach((cell, i) => {
      cell.textContent = grid[i] || "";
      cell.className = grid[i] ? "cell dark" : "cell empty";
      if (i === newest) cell.classList.add("tile-new");
      if (mergedTargets.has(i)) cell.classList.add("tile-merged");
      cell.style.background = grid[i] ? `hsl(${330 - Math.log2(grid[i]) * 8}, 84%, ${78 - Math.min(Math.log2(grid[i]) * 3, 32)}%)` : "";
    });
    const max = Math.max(...grid);
    setScore(`最大 ${max}`);
    if (max >= Number(settings.game2048.goal)) recordResult(max, `达到 ${settings.game2048.goal}`);
    const hasEmpty = grid.some((value) => !value);
    const hasMerge = grid.some((value, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      return (col < 3 && value === grid[index + 1]) || (row < 3 && value === grid[index + 4]);
    });
    if (!over && !hasEmpty && !hasMerge) {
      over = true;
      recordResult(max, "\u65e0\u6cd5\u7ee7\u7eed\u5408\u5e76\uff0c\u672c\u5c40\u7ed3\u675f");
    }
  };
  const animateSlides = (slides) => {
    slides.filter(({ from, to }) => from !== to).forEach(({ from, to, value }) => {
      const source = cells[from];
      const target = cells[to];
      const ghost = document.createElement("span");
      ghost.className = "tile-ghost";
      ghost.textContent = value;
      ghost.style.left = `${source.offsetLeft}px`;
      ghost.style.top = `${source.offsetTop}px`;
      ghost.style.width = `${source.offsetWidth}px`;
      ghost.style.height = `${source.offsetHeight}px`;
      ghost.style.background = `hsl(${330 - Math.log2(value) * 8}, 84%, ${78 - Math.min(Math.log2(value) * 3, 32)}%)`;
      board.append(ghost);
      requestAnimationFrame(() => {
        ghost.style.transform = `translate(${target.offsetLeft - source.offsetLeft}px, ${target.offsetTop - source.offsetTop}px)`;
      });
      setTimeout(() => ghost.remove(), 170);
    });
  };
  const showTrail = (key) => {
    const directions = {
      ArrowUp: ["\u2191", "trail-up"],
      ArrowDown: ["\u2193", "trail-down"],
      ArrowLeft: ["\u2190", "trail-left"],
      ArrowRight: ["\u2192", "trail-right"],
    };
    const [arrow, className] = directions[key];
    trail.textContent = arrow;
    trail.className = "swipe-trail";
    void trail.offsetWidth;
    trail.classList.add(className);
  };
  const moveLine = (indices, slides, mergedTargets) => {
    const items = indices.filter((index) => grid[index]).map((index) => ({ value: grid[index], sources: [index], merged: false }));
    const result = [];
    items.forEach((item) => {
      const last = result[result.length - 1];
      if (last && last.value === item.value && !last.merged) {
        last.value *= 2;
        last.sources.push(...item.sources);
        last.merged = true;
      } else {
        result.push(item);
      }
    });
    indices.forEach((index) => grid[index] = 0);
    result.forEach((item, position) => {
      const target = indices[position];
      grid[target] = item.value;
      item.sources.forEach((source) => slides.push({ from: source, to: target, value: item.value / item.sources.length }));
      if (item.merged) mergedTargets.add(target);
    });
  };
  const move = (key) => {
    if (over) return;
    const before = grid.join();
    const slides = [];
    const mergedTargets = new Set();
    for (let n = 0; n < 4; n++) {
      const line = key === "ArrowLeft" ? [0, 1, 2, 3].map((c) => n * 4 + c)
        : key === "ArrowRight" ? [3, 2, 1, 0].map((c) => n * 4 + c)
        : key === "ArrowUp" ? [0, 1, 2, 3].map((r) => r * 4 + n)
        : [3, 2, 1, 0].map((r) => r * 4 + n);
      moveLine(line, slides, mergedTargets);
    }
    if (grid.join() !== before) {
      addTile();
      draw(mergedTargets);
      animateSlides(slides);
      showTrail(key);
    } else {
      draw();
    }
  };
  const keyCleanup = bindKey((event) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      move(event.key);
    }
  });
  let touchStart = null;
  board.addEventListener("touchstart", (event) => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  board.addEventListener("touchend", (event) => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    touchStart = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    event.preventDefault();
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "ArrowRight" : "ArrowLeft") : (dy > 0 ? "ArrowDown" : "ArrowUp"));
  }, { passive: false });
  for (let i = 0; i < settings.game2048.start; i++) addTile();
  draw();
  setMessage("黄色描边是最新出现的方块。");
  cleanup = keyCleanup;
}

function runMemory() {
  const pairs = Math.max(4, Math.min(18, settings.memory.pairs));
  const deck = shuffle(Array.from({ length: pairs }, (_, i) => characters[i % characters.length]).flatMap((v) => [v, v]));
  const cols = Math.ceil(Math.sqrt(deck.length));
  const board = makeBoard(Math.ceil(deck.length / cols), cols, "memory-board");
  const availableWidth = Math.min(window.innerWidth - 36, 720);
  const cardSize = Math.max(50, Math.min(104, Math.floor((availableWidth - (cols - 1) * 10) / cols)));
  let open = [];
  let matched = 0;
  let moves = 0;
  const cells = deck.map((char) => {
    const cell = document.createElement("button");
    cell.className = "cell memory-card";
    cell.type = "button";
    cell.style.width = cell.style.height = `${cardSize}px`;
    const reveal = () => {
      cell.innerHTML = badge(char, "memory-symbol");
      cell.classList.add("revealed");
    };
    const hide = () => {
      cell.innerHTML = "";
      cell.classList.remove("revealed");
    };
    cell.addEventListener("click", () => {
      if (cell.innerHTML || open.length === 2) return;
      reveal();
      open.push({ cell, char, hide });
      if (open.length === 2) {
        moves++;
        setScore(`步数 ${moves}`);
        if (open[0].char.id === open[1].char.id) {
          matched += 2;
          open = [];
          if (matched === deck.length) recordResult(Math.max(1, 200 - moves), "全部配对完成");
        } else {
          setTimeout(() => {
            open.forEach((item) => item.hide());
            open = [];
          }, 650);
        }
      }
    });
    board.append(cell);
    if (settings.memory.peek) {
      reveal();
      setTimeout(hide, settings.memory.peek * 1000);
    }
    return cell;
  });
  setMessage(`${pairs} 对角色卡，找出所有配对。`);
}

function canvasGame(width = 640, height = 420) {
  const wrap = document.createElement("div");
  wrap.className = "canvas-wrap";
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  wrap.append(canvas);
  gameArea.append(wrap);
  return canvas.getContext("2d");
}

function drawBadgeCanvas(ctx, char, x, y, r = 13) {
  const image = faceImages.get(char.id);
  ctx.fillStyle = char.color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  if (image && image.complete && image.naturalWidth) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r - 1, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(image, x - r + 1, y - r + 1, (r - 1) * 2, (r - 1) * 2);
    ctx.restore();
  }
}

function runPong() {
  const ctx = canvasGame(640, 760);
  const speed = settings.pong.speed;
  const player = character();
  const rival = characters.find((item) => item.id === settings.pong.rival && item.id !== currentCharacter) || otherCharacter();
  settings.pong.rival = rival.id;
  let playerX = 270;
  let rivalX = 270;
  let ball = { x: 320, y: 520, vx: 3.5 * speed, vy: -5 * speed };
  let score = 0;
  let running = true;

  const setPaddleFromEvent = (event) => {
    const point = event.touches ? event.touches[0] : event;
    const rect = ctx.canvas.getBoundingClientRect();
    playerX = (point.clientX - rect.left) / rect.width * ctx.canvas.width - 58;
  };
  const movePaddle = (event) => {
    event.preventDefault();
    setPaddleFromEvent(event);
  };
  ctx.canvas.addEventListener("pointerdown", movePaddle);
  ctx.canvas.addEventListener("pointermove", movePaddle);
  ctx.canvas.addEventListener("touchmove", movePaddle, { passive: false });

  const drawPaddle = (x, y, char, flip = false) => {
    ctx.fillStyle = char.accent;
    ctx.fillRect(x, y, 116, 16);
    ctx.fillStyle = char.color;
    ctx.beginPath();
    ctx.ellipse(x + 58, y + (flip ? -10 : 26), 32, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    drawBadgeCanvas(ctx, char, x + 58, y + (flip ? -46 : 60), 24);
  };

  const draw = () => {
    ctx.clearRect(0, 0, 640, 760);
    ctx.fillStyle = "#f6fff8";
    ctx.fillRect(0, 0, 640, 760);
    ctx.fillStyle = "rgba(120,214,166,.26)";
    ctx.fillRect(28, 32, 584, 696);
    ctx.strokeStyle = "rgba(255,255,255,.95)";
    ctx.lineWidth = 8;
    ctx.strokeRect(38, 42, 564, 676);
    ctx.beginPath();
    ctx.moveTo(38, 380);
    ctx.lineTo(602, 380);
    ctx.stroke();
    drawPaddle(rivalX, 78, rival, true);
    drawPaddle(playerX, 650, player, false);
    drawBadgeCanvas(ctx, player, ball.x, ball.y, 17);
  };

  const timer = setInterval(() => {
    if (!running) return;
    rivalX += (ball.x - (rivalX + 58)) * 0.06 * speed;
    rivalX = Math.max(28, Math.min(496, rivalX));
    playerX = Math.max(28, Math.min(496, playerX));
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x < 48 || ball.x > 592) ball.vx *= -1;
    if (ball.y < 120 && ball.x > rivalX && ball.x < rivalX + 116 && ball.vy < 0) {
      ball.vy *= -1;
      ball.vx += (ball.x - (rivalX + 58)) * 0.035;
    }
    if (ball.y > 646 && ball.x > playerX && ball.x < playerX + 116 && ball.vy > 0) {
      ball.vy *= -1.04;
      ball.vx += (ball.x - (playerX + 58)) * 0.035;
      score++;
      setScore("\u56de\u5408 " + score);
    }
    if (ball.y < 28) {
      running = false;
      recordResult(score + 20, "\u8d62\u4e0b\u56de\u5408");
    }
    if (ball.y > 740) {
      running = false;
      recordResult(score, "\u56de\u5408\u7ed3\u675f");
    }
    draw();
  }, 16);
  setMessage("\u62d6\u52a8\u4e0b\u65b9\u7403\u62cd\uff0c\u548c " + rival.name + " \u6253\u4e00\u573a\u8ff7\u4f60\u4e52\u4e53\u7403\u3002");
  draw();
  cleanup = () => {
    clearInterval(timer);
    ctx.canvas.removeEventListener("pointerdown", movePaddle);
    ctx.canvas.removeEventListener("pointermove", movePaddle);
    ctx.canvas.removeEventListener("touchmove", movePaddle);
  };
}


function runBreakout() {
  const ctx = canvasGame(640, 760);
  const speed = settings.breakout.speed;
  let paddle = 270;
  let ball = { x: 320, y: 520, vx: 4 * speed, vy: -4 * speed };
  let bricks = Array.from({ length: settings.breakout.rows * 8 }, (_, i) => ({ x: 22 + (i % 8) * 75, y: 38 + Math.floor(i / 8) * 30, alive: true, char: characters[i % characters.length] }));
  let score = 0;
  const char = character();
  const mouse = (event) => {
    event.preventDefault();
    const point = event.touches ? event.touches[0] : event;
    const rect = ctx.canvas.getBoundingClientRect();
    paddle = (point.clientX - rect.left) / rect.width * ctx.canvas.width - 52;
  };
  ctx.canvas.addEventListener("pointerdown", mouse);
  ctx.canvas.addEventListener("pointermove", mouse);
  ctx.canvas.addEventListener("touchmove", mouse, { passive: false });
  const keyCleanup = bindKey((event) => {
    if (event.key === "ArrowLeft") paddle -= 24;
    if (event.key === "ArrowRight") paddle += 24;
  });
  const timer = setInterval(() => {
    paddle = Math.max(0, Math.min(536, paddle));
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x < 12 || ball.x > 628) ball.vx *= -1;
    if (ball.y < 12) ball.vy *= -1;
    if (ball.y > 690 && ball.x > paddle && ball.x < paddle + 104 && ball.vy > 0) ball.vy *= -1;
    bricks.forEach((brick) => {
      if (brick.alive && ball.x > brick.x && ball.x < brick.x + 58 && ball.y > brick.y && ball.y < brick.y + 20) {
        brick.alive = false;
        ball.vy *= -1;
        score += 5;
        setScore(`分数 ${score}`);
      }
    });
    if (!bricks.some((brick) => brick.alive)) {
      setMessage("礼物砖块清空。");
      recordResult(score, "礼物砖块清空");
      clearInterval(timer);
    }
    if (ball.y > 770) {
      setMessage("球掉出去了，按重开再来。");
      recordResult(score, "球掉出去了");
      clearInterval(timer);
    }
    ctx.clearRect(0, 0, 640, 760);
    ctx.fillStyle = "#fff4fb";
    ctx.fillRect(0, 0, 640, 760);
    bricks.forEach((brick) => {
      if (!brick.alive) return;
      ctx.fillStyle = brick.char.color;
      ctx.fillRect(brick.x, brick.y, 58, 20);
    });
    ctx.fillStyle = "#89cdf8";
    ctx.fillRect(paddle, 710, 104, 16);
    drawBadgeCanvas(ctx, char, ball.x, ball.y, 12);
  }, 16);
  setMessage(`${settings.breakout.rows} 行砖块，速度 ${speed}x。`);
  cleanup = () => {
    clearInterval(timer);
    keyCleanup();
    ctx.canvas.removeEventListener("pointerdown", mouse);
    ctx.canvas.removeEventListener("pointermove", mouse);
    ctx.canvas.removeEventListener("touchmove", mouse);
  };
}

function runSnake() {
  const size = Math.max(12, Math.min(25, settings.snake.size));
  const baseSpeed = Math.max(0.8, Math.min(3, settings.snake.speed));
  const board = makeBoard(size, size, "snake-board");
  const char = character();
  const foodChar = otherCharacter();
  const cells = Array.from({ length: size * size }, () => {
    const cell = document.createElement("div");
    cell.className = "cell";
    board.append(cell);
    return cell;
  });
  let snake = [{ x: Math.floor(size / 2), y: Math.floor(size / 2) }];
  let direction = { x: 1, y: 0 };
  let nextDirection = direction;
  let food = null;
  let score = 0;
  let running = true;
  let timer = null;

  const indexOf = ({ x, y }) => y * size + x;
  const samePoint = (a, b) => a.x === b.x && a.y === b.y;
  const placeFood = () => {
    const empty = Array.from({ length: size * size }, (_, index) => ({
      x: index % size,
      y: Math.floor(index / size),
    })).filter((point) => !snake.some((part) => samePoint(part, point)));
    food = empty.length ? empty[rand(empty.length)] : null;
  };
  const interval = () => Math.max(72, Math.round(310 / (baseSpeed + score / 120)));
  const schedule = () => {
    clearTimeout(timer);
    if (running) timer = setTimeout(tick, interval());
  };
  const draw = () => {
    cells.forEach((cell) => {
      cell.className = "cell";
      cell.innerHTML = "";
    });
    snake.slice(1).forEach((part) => cells[indexOf(part)].classList.add("dark"));
    cells[indexOf(snake[0])].innerHTML = badge(char, "player-symbol");
    if (food) cells[indexOf(food)].innerHTML = badge(foodChar, "food-symbol");
    setScore(`\u5206\u6570 ${score}`);
  };
  const finish = (text) => {
    running = false;
    clearTimeout(timer);
    recordResult(score, text);
  };
  function tick() {
    direction = nextDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const hitWall = head.x < 0 || head.x >= size || head.y < 0 || head.y >= size;
    const grows = food && samePoint(head, food);
    const bodyToCheck = grows ? snake : snake.slice(0, -1);
    const hitSelf = bodyToCheck.some((part) => samePoint(part, head));
    if (hitWall || hitSelf) {
      finish("\u78b0\u5230\u969c\u788d\uff0c\u672c\u5c40\u7ed3\u675f");
      return;
    }
    snake.unshift(head);
    if (grows) {
      score += Math.round(10 * baseSpeed);
      placeFood();
      if (!food) {
        draw();
        finish("\u68cb\u76d8\u5df2\u7ecf\u586b\u6ee1");
        return;
      }
    } else {
      snake.pop();
    }
    draw();
    schedule();
  }

  const pad = document.createElement("div");
  pad.className = "snake-pad";
  pad.innerHTML = `
    <button type="button" data-direction="up" aria-label="\u5411\u4e0a">\u2191</button>
    <button type="button" data-direction="left" aria-label="\u5411\u5de6">\u2190</button>
    <button type="button" data-direction="down" aria-label="\u5411\u4e0b">\u2193</button>
    <button type="button" data-direction="right" aria-label="\u5411\u53f3">\u2192</button>
  `;
  document.body.append(pad);
  const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };
  const steer = (event) => {
    event.preventDefault();
    const button = event.target.closest("[data-direction]");
    if (!button || !running) return;
    const selected = directions[button.dataset.direction];
    if (selected.x !== -direction.x || selected.y !== -direction.y) nextDirection = selected;
  };
  pad.addEventListener("pointerdown", steer);
  placeFood();
  draw();
  setMessage("\u7528\u5e95\u90e8\u65b9\u5411\u952e\u63a7\u5236\u89d2\u8272\uff0c\u5403\u6389\u98df\u7269\u83b7\u5f97\u5206\u6570\u3002");
  schedule();
  cleanup = () => {
    clearTimeout(timer);
    pad.removeEventListener("pointerdown", steer);
    pad.remove();
  };
}

function runTetris() {
  const ctx = canvasGame(640, 760);
  const cols = 10;
  const rows = 20;
  const cellSize = 32;
  const offsetX = 160;
  const offsetY = 60;
  const baseSpeed = Math.max(0.5, Math.min(3, settings.tetris.speed));
  const char = character();
  const shapes = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
    J: [[1, 0, 0], [1, 1, 1]],
    L: [[0, 0, 1], [1, 1, 1]],
  };
  const shapeNames = Object.keys(shapes);
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  let score = 0;
  let lines = 0;
  let running = true;
  let dropTimer = null;
  let holdTimer = null;
  let repeatTimer = null;

  const copyShape = (shape) => shape.map((row) => [...row]);
  const spawn = () => {
    const name = shapeNames[rand(shapeNames.length)];
    const shape = copyShape(shapes[name]);
    return { name, shape, x: Math.floor((cols - shape[0].length) / 2), y: 0 };
  };
  let piece = spawn();

  const eachBlock = (target, callback) => {
    target.shape.forEach((row, y) => {
      row.forEach((filled, x) => {
        if (filled) callback(target.x + x, target.y + y);
      });
    });
  };
  const collides = (target) => {
    let blocked = false;
    eachBlock(target, (x, y) => {
      if (x < 0 || x >= cols || y >= rows || (y >= 0 && grid[y][x])) blocked = true;
    });
    return blocked;
  };
  const rotateShape = (shape) => shape[0].map((_, column) => shape.map((row) => row[column]).reverse());
  const drawBlock = (x, y, color = char.color) => {
    const px = offsetX + x * cellSize;
    const py = offsetY + y * cellSize;
    ctx.fillStyle = color;
    ctx.fillRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
    ctx.strokeStyle = char.accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(px + 3, py + 3, cellSize - 6, cellSize - 6);
  };
  const draw = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#fff4fb";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "rgba(255, 211, 232, 0.62)";
    ctx.fillRect(offsetX, offsetY, cols * cellSize, rows * cellSize);
    ctx.strokeStyle = "rgba(232, 87, 155, 0.14)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath();
      ctx.moveTo(offsetX + x * cellSize, offsetY);
      ctx.lineTo(offsetX + x * cellSize, offsetY + rows * cellSize);
      ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + y * cellSize);
      ctx.lineTo(offsetX + cols * cellSize, offsetY + y * cellSize);
      ctx.stroke();
    }
    grid.forEach((row, y) => row.forEach((filled, x) => {
      if (filled) drawBlock(x, y);
    }));
    eachBlock(piece, (x, y) => {
      if (y >= 0) drawBlock(x, y);
    });
  };
  const currentDelay = () => Math.max(90, Math.round(720 / (baseSpeed + score / 1200)));
  const scheduleDrop = () => {
    clearTimeout(dropTimer);
    if (running) dropTimer = setTimeout(() => stepDown(), currentDelay());
  };
  const finish = () => {
    running = false;
    clearTimeout(dropTimer);
    clearTimeout(holdTimer);
    clearInterval(repeatTimer);
    recordResult(score, "\u65b9\u5757\u5806\u5230\u9876\u90e8\uff0c\u672c\u5c40\u7ed3\u675f");
  };
  const clearLines = () => {
    let cleared = 0;
    for (let y = rows - 1; y >= 0; y--) {
      if (grid[y].every(Boolean)) {
        grid.splice(y, 1);
        grid.unshift(Array(cols).fill(0));
        cleared++;
        y++;
      }
    }
    if (!cleared) return;
    lines += cleared;
    score += cleared * 100 + Math.max(0, cleared - 1) * 50;
    setScore(`\u5206\u6570 ${score}`);
    setMessage(`\u6d88\u9664 ${cleared} \u884c\uff0c\u7d2f\u8ba1 ${lines} \u884c\u3002`);
  };
  const lockPiece = () => {
    eachBlock(piece, (x, y) => {
      if (y >= 0) grid[y][x] = 1;
    });
    clearLines();
    piece = spawn();
    if (collides(piece)) {
      draw();
      finish();
    }
  };
  const move = (dx) => {
    if (!running) return;
    const candidate = { ...piece, x: piece.x + dx };
    if (!collides(candidate)) piece = candidate;
    draw();
  };
  const rotate = () => {
    if (!running) return;
    const rotated = rotateShape(piece.shape);
    const kicks = [0, -1, 1, -2, 2];
    const next = kicks.map((kick) => ({ ...piece, x: piece.x + kick, shape: rotated })).find((candidate) => !collides(candidate));
    if (next) piece = next;
    draw();
  };
  function stepDown() {
    if (!running) return;
    const candidate = { ...piece, y: piece.y + 1 };
    if (collides(candidate)) lockPiece();
    else piece = candidate;
    draw();
    scheduleDrop();
  }

  const pad = document.createElement("div");
  pad.className = "tetris-pad";
  pad.innerHTML = `
    <div class="tetris-pad-group">
      <button type="button" data-action="left" aria-label="\u5411\u5de6">\u2190</button>
      <button type="button" data-action="right" aria-label="\u5411\u53f3">\u2192</button>
    </div>
    <div class="tetris-pad-group">
      <button type="button" data-action="rotate" aria-label="\u65cb\u8f6c">\u21bb</button>
      <button type="button" data-action="down" aria-label="\u52a0\u901f\u4e0b\u843d">\u2193</button>
    </div>
  `;
  document.body.append(pad);
  const runAction = (action) => {
    if (action === "left") move(-1);
    if (action === "right") move(1);
    if (action === "rotate") rotate();
    if (action === "down") stepDown();
  };
  const stopHold = (event) => {
    if (event) event.preventDefault();
    clearTimeout(holdTimer);
    clearInterval(repeatTimer);
    holdTimer = null;
    repeatTimer = null;
  };
  const startHold = (event) => {
    event.preventDefault();
    const button = event.target.closest("[data-action]");
    if (!button || !running) return;
    const action = button.dataset.action;
    stopHold();
    runAction(action);
    if (action === "rotate") return;
    holdTimer = setTimeout(() => {
      repeatTimer = setInterval(() => runAction(action), action === "down" ? 65 : 110);
    }, 180);
  };
  pad.addEventListener("pointerdown", startHold);
  pad.addEventListener("pointerup", stopHold);
  pad.addEventListener("pointercancel", stopHold);
  pad.addEventListener("pointerleave", stopHold);
  setScore("\u5206\u6570 0");
  setMessage("\u5de6\u53f3\u79fb\u52a8\u65b9\u5757\uff0c\u53f3\u4fa7\u6309\u94ae\u7528\u4e8e\u65cb\u8f6c\u548c\u52a0\u901f\u4e0b\u843d\u3002");
  draw();
  scheduleDrop();
  cleanup = () => {
    clearTimeout(dropTimer);
    stopHold();
    pad.removeEventListener("pointerdown", startHold);
    pad.removeEventListener("pointerup", stopHold);
    pad.removeEventListener("pointercancel", stopHold);
    pad.removeEventListener("pointerleave", stopHold);
    pad.remove();
  };
}

function runPoker() {
  const suits = ["\u2660", "\u2665", "\u2663", "\u2666"];
  const labels = { 11: "J", 12: "Q", 13: "K", 14: "A", 15: "2", 16: "\u5c0f\u738b", 17: "\u5927\u738b" };
  const rankLabel = (rank) => labels[rank] || String(rank);
  const deck = [];
  for (let rank = 3; rank <= 15; rank++) suits.forEach((suit) => deck.push({ rank, suit, id: `${rank}-${suit}` }));
  deck.push({ rank: 16, suit: "", id: "joker-small" }, { rank: 17, suit: "", id: "joker-big" });
  const cards = shuffle(deck);
  const hands = [cards.slice(0, 17), cards.slice(17, 34), cards.slice(34, 51)];
  const landlordCards = cards.slice(51);
  const sortHand = (hand, descending = false) => hand.sort((a, b) => (a.rank - b.rank || a.suit.localeCompare(b.suit)) * (descending ? -1 : 1));
  hands.forEach(sortHand);
  let phase = "bid";
  let landlord = null;
  let turn = 0;
  let lastPlay = null;
  let passes = 0;
  let multiplier = 1;
  let selected = new Set();
  let aiTimer = null;
  let lastTouch = 0;
  let playerDescending = false;
  let playerHasPlayed = false;
  let running = true;

  const table = document.createElement("div");
  table.className = "poker-table";
  const aiTop = document.createElement("div");
  aiTop.className = "poker-ai poker-ai-top";
  const aiSide = document.createElement("div");
  aiSide.className = "poker-ai poker-ai-side";
  const center = document.createElement("div");
  center.className = "poker-center";
  const handEl = document.createElement("div");
  handEl.className = "poker-hand";
  const actions = document.createElement("div");
  actions.className = "poker-actions";
  table.append(aiTop, aiSide, center);
  gameArea.append(table);
  document.body.append(actions, handEl);

  const countsFor = (playCards) => {
    const counts = new Map();
    playCards.forEach((card) => counts.set(card.rank, (counts.get(card.rank) || 0) + 1));
    return [...counts.entries()].sort((a, b) => a[0] - b[0]);
  };
  const consecutive = (ranks) => ranks.every((rank, index) => index === 0 || rank === ranks[index - 1] + 1);
  const classify = (playCards) => {
    const sorted = [...playCards].sort((a, b) => a.rank - b.rank);
    const counts = countsFor(sorted);
    const ranks = counts.map(([rank]) => rank);
    const byCount = (amount) => counts.filter(([, count]) => count === amount).map(([rank]) => rank);
    if (sorted.length === 2 && ranks.length === 2 && ranks[0] === 16 && ranks[1] === 17) return { type: "rocket", power: 99, length: 2 };
    if (sorted.length === 4 && counts.length === 1) return { type: "bomb", power: ranks[0], length: 4 };
    if (sorted.length === 1) return { type: "single", power: ranks[0], length: 1 };
    if (sorted.length === 2 && counts.length === 1) return { type: "pair", power: ranks[0], length: 2 };
    if (sorted.length === 3 && counts.length === 1) return { type: "triple", power: ranks[0], length: 3 };
    if (sorted.length === 4 && byCount(3).length === 1 && byCount(1).length === 1) return { type: "tripleSingle", power: byCount(3)[0], length: 4 };
    if (sorted.length === 5 && byCount(3).length === 1 && byCount(2).length === 1) return { type: "triplePair", power: byCount(3)[0], length: 5 };
    if (sorted.length === 6 && byCount(4).length === 1) return { type: "fourTwoSingles", power: byCount(4)[0], length: 6 };
    if (sorted.length === 8 && byCount(4).length === 1 && byCount(2).length === 2) return { type: "fourTwoPairs", power: byCount(4)[0], length: 8 };
    if (sorted.length >= 5 && counts.every(([, count]) => count === 1) && ranks[ranks.length - 1] < 15 && consecutive(ranks)) return { type: "straight", power: ranks[ranks.length - 1], length: sorted.length };
    if (sorted.length >= 6 && sorted.length % 2 === 0 && counts.every(([, count]) => count === 2) && ranks[ranks.length - 1] < 15 && consecutive(ranks)) return { type: "pairStraight", power: ranks[ranks.length - 1], length: sorted.length };
    if (sorted.length >= 6 && sorted.length % 3 === 0 && counts.every(([, count]) => count === 3) && ranks[ranks.length - 1] < 15 && consecutive(ranks)) return { type: "airplane", power: ranks[ranks.length - 1], length: sorted.length };
    const tripleRanks = ranks.filter((rank) => rank < 15 && (counts.find(([value]) => value === rank)[1] >= 3));
    for (let start = 0; start < tripleRanks.length; start++) {
      for (let end = start + 1; end < tripleRanks.length; end++) {
        const run = tripleRanks.slice(start, end + 1);
        if (!consecutive(run)) break;
        const wings = sorted.filter((card) => !run.includes(card.rank));
        if (wings.length === run.length && sorted.length === run.length * 4) return { type: "airplaneSingles", power: run[run.length - 1], length: sorted.length };
        const wingCounts = countsFor(wings);
        if (wings.length === run.length * 2 && wingCounts.length === run.length && wingCounts.every(([, count]) => count === 2)) return { type: "airplanePairs", power: run[run.length - 1], length: sorted.length };
      }
    }
    return null;
  };
  const beats = (play, previous) => {
    if (!play) return false;
    if (!previous) return true;
    if (play.type === "rocket") return true;
    if (previous.type === "rocket") return false;
    if (play.type === "bomb" && previous.type !== "bomb") return true;
    return play.type === previous.type && play.length === previous.length && play.power > previous.power;
  };
  const groups = (hand) => {
    const map = new Map();
    hand.forEach((card) => {
      if (!map.has(card.rank)) map.set(card.rank, []);
      map.get(card.rank).push(card);
    });
    return map;
  };
  const candidatesFor = (hand) => {
    const map = groups(hand);
    const ranks = [...map.keys()].sort((a, b) => a - b);
    const result = [];
    const add = (cardsToAdd) => {
      const type = classify(cardsToAdd);
      if (type) result.push({ cards: cardsToAdd, type });
    };
    const combinations = (items, amount) => {
      if (amount === 0) return [[]];
      const output = [];
      items.forEach((item, index) => {
        combinations(items.slice(index + 1), amount - 1).forEach((rest) => output.push([item, ...rest]));
      });
      return output;
    };
    ranks.forEach((rank) => {
      const group = map.get(rank);
      add([group[0]]);
      if (group.length >= 2) add(group.slice(0, 2));
      if (group.length >= 3) {
        add(group.slice(0, 3));
        const single = ranks.find((other) => other !== rank);
        if (single !== undefined) add([...group.slice(0, 3), map.get(single)[0]]);
        const pair = ranks.find((other) => other !== rank && map.get(other).length >= 2);
        if (pair !== undefined) add([...group.slice(0, 3), ...map.get(pair).slice(0, 2)]);
      }
      if (group.length === 4) {
        add(group.slice(0, 4));
        const rest = hand.filter((card) => card.rank !== rank);
        combinations(rest, 2).forEach((wings) => add([...group, ...wings]));
        const pairs = ranks.filter((other) => other !== rank && map.get(other).length >= 2);
        combinations(pairs, 2).forEach((pairRanks) => add([...group, ...pairRanks.flatMap((value) => map.get(value).slice(0, 2))]));
      }
    });
    if (map.has(16) && map.has(17)) add([map.get(16)[0], map.get(17)[0]]);
    const addRuns = (amount, minRanks) => {
      const eligible = ranks.filter((rank) => rank < 15 && map.get(rank).length >= amount);
      for (let start = 0; start < eligible.length; start++) {
        for (let end = start + minRanks - 1; end < eligible.length; end++) {
          const run = eligible.slice(start, end + 1);
          if (!consecutive(run)) break;
          add(run.flatMap((rank) => map.get(rank).slice(0, amount)));
        }
      }
    };
    addRuns(1, 5);
    addRuns(2, 3);
    addRuns(3, 2);
    const tripleRanks = ranks.filter((rank) => rank < 15 && map.get(rank).length >= 3);
    for (let start = 0; start < tripleRanks.length; start++) {
      for (let end = start + 1; end < tripleRanks.length; end++) {
        const run = tripleRanks.slice(start, end + 1);
        if (!consecutive(run)) break;
        const core = run.flatMap((rank) => map.get(rank).slice(0, 3));
        const rest = hand.filter((card) => !run.includes(card.rank));
        combinations(rest, run.length).forEach((wings) => add([...core, ...wings]));
        const pairs = ranks.filter((rank) => !run.includes(rank) && map.get(rank).length >= 2);
        combinations(pairs, run.length).forEach((pairRanks) => add([...core, ...pairRanks.flatMap((rank) => map.get(rank).slice(0, 2))]));
      }
    }
    return result.sort((a, b) => a.cards.length - b.cards.length || a.type.power - b.type.power);
  };
  const legalCandidates = (hand) => candidatesFor(hand).filter((play) => beats(play.type, lastPlay && lastPlay.type));
  const renderCard = (card, selectable = false) => {
    const red = card.suit === "\u2665" || card.suit === "\u2666";
    return `<button class="poker-card ${red ? "red" : ""} ${selected.has(card.id) ? "selected" : ""}" type="button" ${selectable ? `data-card="${card.id}"` : "disabled"}>
      <strong>${rankLabel(card.rank)}</strong><span>${card.suit}</span>
    </button>`;
  };
  const renderBacks = (count) => Array.from({ length: Math.min(count, 14) }, () => '<span class="poker-ai-card"></span>').join("");
  const render = () => {
    aiTop.innerHTML = `<strong>\u4e0a\u5bb6 ${hands[1].length} \u5f20${landlord === 1 ? " \u00b7 \u5730\u4e3b" : ""}</strong><div>${renderBacks(hands[1].length)}</div>`;
    aiSide.innerHTML = `<strong>\u4e0b\u5bb6 ${hands[2].length} \u5f20${landlord === 2 ? " \u00b7 \u5730\u4e3b" : ""}</strong><div>${renderBacks(hands[2].length)}</div>`;
    const last = lastPlay ? lastPlay.cards.map((card) => renderCard(card)).join("") : "<em>\u7b49\u5f85\u51fa\u724c</em>";
    center.innerHTML = `
      <div class="poker-meta">\u500d\u7387 ${multiplier}x ${landlord === null ? "" : `\u00b7 ${landlord === 0 ? "\u4f60" : landlord === 1 ? "\u4e0a\u5bb6" : "\u4e0b\u5bb6"}\u662f\u5730\u4e3b`}</div>
      <div class="poker-landlord">\u5730\u4e3b\u724c\uff1a${landlordCards.map((card) => renderCard(card)).join("")}</div>
      <div class="poker-last"><span>\u4e0a\u4e00\u624b</span><div>${last}</div></div>`;
    handEl.innerHTML = hands[0].map((card) => renderCard(card, phase === "play" && turn === 0)).join("");
    const sortButton = playerHasPlayed ? "" : `<button class="primary-button poker-sort-button" type="button" data-poker-action="sort">\u6574\u7406\uff1a${playerDescending ? "\u5927\u2192\u5c0f" : "\u5c0f\u2192\u5927"}</button>`;
    if (phase === "bid") {
      actions.innerHTML = `<button class="primary-button" type="button" data-poker-action="bid">\u53eb\u5730\u4e3b</button><button class="primary-button" type="button" data-poker-action="skip-bid">\u4e0d\u53eb</button>${sortButton}`;
    } else {
      actions.innerHTML = `<button class="primary-button" type="button" data-poker-action="play" ${selected.size ? "" : "disabled"}>\u51fa\u724c</button>
        <button class="primary-button" type="button" data-poker-action="pass" ${!lastPlay || lastPlay.player === 0 ? "disabled" : ""}>\u4e0d\u51fa</button>
        <button class="primary-button" type="button" data-poker-action="hint">\u63d0\u793a</button>${sortButton}`;
    }
  };
  const finish = (winner) => {
    running = false;
    clearTimeout(aiTimer);
    const playerWon = winner === 0;
    recordResult(playerWon ? 100 * multiplier : 0, playerWon ? "\u4f60\u51fa\u5b8c\u4e86\u624b\u724c\uff0c\u83b7\u5f97\u80dc\u5229" : "\u7535\u8111\u5148\u51fa\u5b8c\u4e86\u624b\u724c");
  };
  const nextTurn = () => {
    turn = (turn + 1) % 3;
    render();
    if (running && turn !== 0) scheduleAi();
  };
  const playCards = (player, play) => {
    hands[player] = hands[player].filter((card) => !play.cards.some((used) => used.id === card.id));
    if (player === 0) playerHasPlayed = true;
    if (play.type.type === "bomb" || play.type.type === "rocket") multiplier *= 2;
    lastPlay = { ...play, player };
    passes = 0;
    if (!hands[player].length) {
      render();
      finish(player);
      return;
    }
    nextTurn();
  };
  const pass = () => {
    passes++;
    if (passes >= 2) {
      lastPlay = null;
      passes = 0;
    }
    nextTurn();
  };
  const aiPlay = () => {
    if (!running || phase !== "play" || turn === 0) return;
    const options = legalCandidates(hands[turn]);
    const level = settings.poker.level;
    const shouldPass = lastPlay && options.length && Math.random() < (level === "easy" ? 0.42 : level === "normal" ? 0.2 : 0.08);
    if (!options.length || shouldPass) pass();
    else {
      const play = level === "hard" ? options[0] : options[rand(Math.min(options.length, level === "easy" ? options.length : 3))];
      playCards(turn, play);
    }
  };
  function scheduleAi() {
    clearTimeout(aiTimer);
    setMessage(turn === 1 ? "\u4e0a\u5bb6\u601d\u8003\u4e2d\u2026" : "\u4e0b\u5bb6\u601d\u8003\u4e2d\u2026");
    aiTimer = setTimeout(aiPlay, 650);
  }
  const startPlay = (chosenLandlord) => {
    landlord = chosenLandlord;
    hands[landlord].push(...landlordCards);
    sortHand(hands[landlord], landlord === 0 && playerDescending);
    phase = "play";
    turn = landlord;
    selected.clear();
    setMessage(landlord === 0 ? "\u4f60\u662f\u5730\u4e3b\uff0c\u8bf7\u5148\u51fa\u724c\u3002" : "\u7535\u8111\u53eb\u5230\u4e86\u5730\u4e3b\u3002");
    render();
    if (turn !== 0) scheduleAi();
  };
  const handleAction = (event) => {
    event.preventDefault();
    const button = event.target.closest("[data-poker-action]");
    if (!button || button.disabled || !running) return;
    const action = button.dataset.pokerAction;
    if (action === "sort") {
      playerDescending = !playerDescending;
      sortHand(hands[0], playerDescending);
      return render();
    }
    if (action === "bid") return startPlay(0);
    if (action === "skip-bid") return startPlay(Math.random() < 0.5 ? 1 : 2);
    if (turn !== 0) return;
    if (action === "pass") return pass();
    const hint = legalCandidates(hands[0])[0];
    if (action === "hint") {
      selected = new Set(hint ? hint.cards.map((card) => card.id) : []);
      setMessage(hint ? "\u5df2\u9009\u4e2d\u4e00\u7ec4\u53ef\u51fa\u7684\u724c\u3002" : "\u6682\u65f6\u6ca1\u6709\u53ef\u4ee5\u538b\u8fc7\u4e0a\u5bb6\u7684\u724c\u3002");
      return render();
    }
    if (action === "play") {
      const chosen = hands[0].filter((card) => selected.has(card.id));
      const type = classify(chosen);
      if (!beats(type, lastPlay && lastPlay.type)) {
        setMessage("\u8fd9\u7ec4\u724c\u4e0d\u7b26\u5408\u89c4\u5219\uff0c\u8bf7\u91cd\u65b0\u9009\u62e9\u3002");
        return;
      }
      selected.clear();
      playCards(0, { cards: chosen, type });
    }
  };
  const toggleCard = (event) => {
    event.preventDefault();
    const button = event.target.closest("[data-card]");
    if (!button || turn !== 0 || phase !== "play") return;
    if (selected.has(button.dataset.card)) selected.delete(button.dataset.card);
    else selected.add(button.dataset.card);
    render();
  };
  const touchAction = (event) => {
    lastTouch = Date.now();
    handleAction(event);
  };
  const clickAction = (event) => {
    if (Date.now() - lastTouch > 500) handleAction(event);
  };
  const touchCard = (event) => {
    lastTouch = Date.now();
    toggleCard(event);
  };
  const clickCard = (event) => {
    if (Date.now() - lastTouch > 500) toggleCard(event);
  };
  actions.addEventListener("touchstart", touchAction, { passive: false });
  actions.addEventListener("click", clickAction);
  handEl.addEventListener("touchstart", touchCard, { passive: false });
  handEl.addEventListener("click", clickCard);
  handEl.addEventListener("touchmove", (event) => event.preventDefault(), { passive: false });
  setScore("\u7b49\u5f85\u53eb\u5730\u4e3b");
  setMessage("\u8bf7\u9009\u62e9\u662f\u5426\u53eb\u5730\u4e3b\u3002");
  render();
  cleanup = () => {
    clearTimeout(aiTimer);
    actions.remove();
    handEl.remove();
  };
}

const gameRunners = {
  mines: runMines,
  gomoku: runGomoku,
  game2048: run2048,
  memory: runMemory,
  pong: runPong,
  breakout: runBreakout,
  snake: runSnake,
  tetris: runTetris,
  poker: runPoker,
};

renderMenu();
renderCharacters();
activeGame = games[0];
title.textContent = "\u8bf7\u9009\u62e9\u6e38\u620f";
kicker.textContent = "\u4e09\u4e3d\u9e25\u5bb6\u65cf";
setMessage("\u4ece\u83dc\u5355\u9009\u62e9\u4e00\u4e2a\u5c0f\u6e38\u620f\u5f00\u59cb\u3002");
openDrawer();
