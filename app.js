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
const records = JSON.parse(localStorage.getItem("gameKittyRecords") || "{}");

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
];

const defaults = {
  mines: { size: 16, mines: 40 },
  gomoku: { level: "hard", size: 15 },
  game2048: { start: 2, goal: 2048 },
  memory: { pairs: 8, peek: 0 },
  pong: { speed: 1.2, rival: "melody" },
  breakout: { rows: 5, speed: 1.15 },
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
  gameArea.focus();
}

function bindKey(handler) {
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}

function badge(char = character(), className = "player-symbol") {
  return `<span class="${className}" style="background:${char.color};box-shadow:inset 0 -3px 0 ${char.accent}"><img class="face" src="${char.img}" alt="${char.name}"></span>`;
}

function renderCharacters() {
  characterPicker.innerHTML = characters.map((char) => `
    <button class="character-button ${char.id === currentCharacter ? "active" : ""}" type="button" data-character="${char.id}">
      <span class="avatar" style="background:${char.color};box-shadow:inset 0 -3px 0 ${char.accent}"><img class="face" src="${char.img}" alt="${char.name}"></span>
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
  };
  difficultyPanel.innerHTML = panels[id]();
}

function loadGame(id) {
  const game = games.find((item) => item.id === id);
  activeGame = game;
  document.body.dataset.game = id;
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
  const board = makeBoard(size, size);
  const zoomBar = document.createElement("div");
  zoomBar.className = "zoom-bar";
  zoomBar.innerHTML = '<button class="small-button" type="button" data-zoom="-1">-</button><button class="small-button" type="button" data-zoom="1">+</button>';
  document.body.append(zoomBar);
  let cellSize = size > 22 ? 32 : 46;
  zoomBar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-zoom]");
    if (!button) return;
    cellSize = Math.max(20, Math.min(58, cellSize + Number(button.dataset.zoom) * 4));
    cells.forEach((cell) => cell.style.width = cell.style.height = `${cellSize}px`);
  });
  cleanup = () => {
    zoomBar.remove();
    clickTimers.forEach((timer) => clearTimeout(timer));
  };
  const char = character();
  setScore(`雷 ${mineCount}`);
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
    if (size > 22) cell.style.width = cell.style.height = "28px";
    const toggleFlag = () => {
      if (revealed.has(index)) return;
      if (flagged.has(index)) {
        flagged.delete(index);
        cell.classList.remove("flagged");
        cell.innerHTML = "";
      } else {
        flagged.add(index);
        cell.classList.add("flagged");
        cell.innerHTML = '<span class="cute-flag" aria-label="标记有雷">🎀</span>';
      }
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
      setScore(`安全 ${revealed.size}/${total - mineCount}`);
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

function runSnake() {
  const size = Math.max(12, Math.min(30, settings.snake.size));
  const interval = Math.max(45, Math.round(180 / settings.snake.speed));
  const board = makeBoard(size, size);
  const cells = Array.from({ length: size * size }, () => {
    const cell = document.createElement("div");
    cell.className = "cell empty";
    if (size > 22) cell.style.width = cell.style.height = "28px";
    board.append(cell);
    return cell;
  });
  let snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }];
  let dir = { x: 1, y: 0 };
  let nextDir = dir;
  let food = { x: size - 4, y: 5 };
  let score = 0;
  let alive = true;
  const char = character();
  setMessage(`${char.name} 以 ${settings.snake.speed}x 速度移动。`);

  const draw = () => {
    cells.forEach((cell) => {
      cell.className = "cell empty";
      cell.innerHTML = "";
    });
    snake.forEach((part, i) => {
      const cell = cells[part.y * size + part.x];
      cell.className = i ? "cell dark" : "cell hit";
      if (!i) cell.innerHTML = badge(char, "player-symbol");
    });
    cells[food.y * size + food.x].className = "cell revealed";
    cells[food.y * size + food.x].innerHTML = badge(otherCharacter(), "food-symbol");
  };
  const placeFood = () => {
    do food = { x: rand(size), y: rand(size) };
    while (snake.some((part) => part.x === food.x && part.y === food.y));
  };
  const setDirection = (x, y) => {
    if (x !== -dir.x || y !== -dir.y) nextDir = { x, y };
  };
  const keyCleanup = bindKey((event) => {
    const map = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] };
    if (!map[event.key]) return;
    event.preventDefault();
    const [x, y] = map[event.key];
    setDirection(x, y);
  });
  const pad = document.createElement("div");
  pad.className = "snake-pad";
  pad.innerHTML = '<button data-dir="0,-1">↑</button><button data-dir="-1,0">←</button><button data-dir="1,0">→</button><button data-dir="0,1">↓</button>';
  gameArea.append(pad);
  pad.addEventListener("pointerdown", (event) => {
    const button = event.target.closest("[data-dir]");
    if (!button) return;
    const [x, y] = button.dataset.dir.split(",").map(Number);
    setDirection(x, y);
  });
  const timer = setInterval(() => {
    if (!alive) return;
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    const crash = head.x < 0 || head.x >= size || head.y < 0 || head.y >= size || snake.some((part) => part.x === head.x && part.y === head.y);
    if (crash) {
      alive = false;
      setMessage("撞到了，按重开继续。");
      recordResult(score, "撞到了");
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += Math.round(10 * settings.snake.speed);
      setScore(`分数 ${score}`);
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }, interval);
  draw();
  cleanup = () => {
    clearInterval(timer);
    keyCleanup();
  };
}

function runGomoku() {
  document.querySelectorAll(".zoom-bar").forEach((bar) => bar.remove());
  const size = Math.max(11, Math.min(19, settings.gomoku.size));
  const board = makeBoard(size, size, "gomoku-board");
  const zoomBar = document.createElement("div");
  zoomBar.className = "zoom-bar";
  zoomBar.innerHTML = '<button class="small-button" type="button" data-zoom="-1">-</button><button class="small-button" type="button" data-zoom="1">+</button>';
  document.body.append(zoomBar);
  let cellSize = size > 15 ? 28 : 32;
  const state = Array(size * size).fill("");
  let over = false;
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
      if (state[index] || over) return;
      place(index, "X", player);
      if (over) return;
      if (!state.some((mark) => !mark)) {
        over = true;
        recordResult(50, "棋盘下满，平局。");
        return;
      }
      const move = bestMove();
      place(move, "O", cpu);
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
  cleanup = () => zoomBar.remove();
}

function run2048() {
  const board = makeBoard(4, 4, "game2048-grid");
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
  const draw = () => {
    cells.forEach((cell, i) => {
      cell.textContent = grid[i] || "";
      cell.className = grid[i] ? "cell dark" : "cell empty";
      if (i === newest) cell.classList.add("tile-new");
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
  const mergeLine = (line) => {
    const values = line.filter(Boolean);
    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] === values[i + 1]) {
        values[i] *= 2;
        values.splice(i + 1, 1);
      }
    }
    while (values.length < 4) values.push(0);
    return values;
  };
  const move = (key) => {
    if (over) return;
    const before = grid.join();
    for (let r = 0; r < 4; r++) {
      const line = [0, 1, 2, 3].map((c) => grid[r * 4 + c]);
      const merged = mergeLine(key === "ArrowRight" ? line.reverse() : line);
      if (key === "ArrowRight") merged.reverse();
      if (key === "ArrowLeft" || key === "ArrowRight") merged.forEach((v, c) => grid[r * 4 + c] = v);
    }
    for (let c = 0; c < 4; c++) {
      const line = [0, 1, 2, 3].map((r) => grid[r * 4 + c]);
      const merged = mergeLine(key === "ArrowDown" ? line.reverse() : line);
      if (key === "ArrowDown") merged.reverse();
      if (key === "ArrowUp" || key === "ArrowDown") merged.forEach((v, r) => grid[r * 4 + c] = v);
    }
    if (grid.join() !== before) addTile();
    draw();
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

function runSimon() {
  const total = Math.max(6, Math.min(24, settings.simon.cards));
  const odd = characters[(characters.findIndex((c) => c.id === currentCharacter) + 1) % characters.length];
  const normal = character();
  const oddIndex = rand(total);
  const cols = Math.ceil(Math.sqrt(total));
  const board = makeBoard(Math.ceil(total / cols), cols, "spot-board");
  Array.from({ length: total }, (_, i) => {
    const cell = document.createElement("button");
    cell.className = "cell revealed spot-card";
    cell.type = "button";
    cell.innerHTML = badge(i === oddIndex ? odd : normal);
    cell.addEventListener("click", () => {
      if (i === oddIndex) {
        const score = total * 10;
        setScore("?? " + score);
        recordResult(score, "找到了不同角色");
      } else {
        recordResult(0, "点错了");
      }
      cell.classList.add("hit");
      board.querySelectorAll("button").forEach((button) => button.disabled = true);
    });
    board.append(cell);
  });
  setMessage("找出唯一不同的角色，共 " + total + " 张。");
}

function runMole() {
  const holes = Math.max(9, Math.min(36, settings.mole.holes));
  const cols = Math.ceil(Math.sqrt(holes));
  const board = makeBoard(Math.ceil(holes / cols), cols, "mole-board");
  let active = -1;
  let score = 0;
  let time = settings.mole.time;
  const char = character();
  const cells = Array.from({ length: holes }, (_, i) => {
    const cell = document.createElement("button");
    cell.className = "cell empty";
    cell.type = "button";
    cell.addEventListener("click", () => {
      if (i === active) {
        score++;
        setScore("?? " + score);
        active = -1;
        draw();
      }
    });
    board.append(cell);
    return cell;
  });
  const draw = () => {
    cells.forEach((cell, i) => {
      cell.innerHTML = i === active ? badge(char) : "";
      cell.className = i === active ? "cell hit" : "cell empty";
    });
  };
  const moleTimer = setInterval(() => { active = rand(holes); draw(); }, Number(settings.mole.speed));
  const clock = setInterval(() => {
    time--;
    setMessage("剩余 " + time + " 秒｜坑数 " + holes);
    if (time <= 0) {
      clearInterval(moleTimer);
      clearInterval(clock);
      active = -1;
      draw();
      recordResult(score, "时间到");
    }
  }, 1000);
  draw();
  setMessage("剩余 " + time + " 秒，" + holes + " 个坑。");
  cleanup = () => { clearInterval(moleTimer); clearInterval(clock); };
}

function runTyping() {
  const ctx = canvasGame(640, 420);
  let score = 0;
  let holding = false;
  let power = 0;
  let player = { x: 141, y: 290 };
  let current = { x: 90, y: 314, w: 104, h: 30 };
  let next = { x: 334, y: 250, w: 96, h: 30 };
  let jumping = false;
  const char = character();
  const scale = settings.typing.power;
  const drawPlatform = (p, color) => { ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(p.x, p.y, p.w, p.h, 12); ctx.fill(); };
  const draw = () => {
    ctx.clearRect(0, 0, 640, 420);
    ctx.fillStyle = "#fff4fb"; ctx.fillRect(0, 0, 640, 420);
    drawPlatform(current, "#ff9fcf"); drawPlatform(next, "#89cdf8");
    ctx.fillStyle = "#e8579b"; ctx.fillRect(44, 34, Math.min(220, power * 3.6), 14);
    drawBadgeCanvas(ctx, char, player.x, player.y, 22);
  };
  const newNext = () => { current = next; player = { x: current.x + current.w / 2, y: current.y - 18 }; next = { x: 260 + rand(250), y: 170 + rand(130), w: 74 + rand(60), h: 30 }; };
  const finishJump = () => {
    const ok = player.x > next.x && player.x < next.x + next.w && Math.abs(player.y - (next.y - 18)) < 42;
    if (ok) { score += 10; setScore("?? " + score); newNext(); draw(); }
    else { recordResult(score, "跳空了"); }
  };
  const release = () => {
    if (!holding || jumping) return;
    holding = false; jumping = true;
    const start = { ...player }; const dx = power * 2.25 * scale; const targetY = next.y - 18;
    let frame = 0;
    const timer = setInterval(() => {
      frame++; const t = frame / 28;
      player.x = start.x + dx * t;
      player.y = start.y + (targetY - start.y) * t - Math.sin(Math.PI * t) * power * 0.9;
      draw();
      if (frame >= 28) { clearInterval(timer); jumping = false; power = 0; finishJump(); }
    }, 16);
  };
  const press = (event) => { event.preventDefault(); if (!jumping) holding = true; };
  const powerTimer = setInterval(() => { if (holding) { power = Math.min(62, power + 1.8); draw(); } }, 16);
  ctx.canvas.addEventListener("pointerdown", press); window.addEventListener("pointerup", release);
  setMessage("按住画面蓄力，松开跳到蓝色平台。"); draw();
  cleanup = () => { clearInterval(powerTimer); ctx.canvas.removeEventListener("pointerdown", press); window.removeEventListener("pointerup", release); };
}

const gameRunners = {
  mines: runMines,
  gomoku: runGomoku,
  game2048: run2048,
  memory: runMemory,
  pong: runPong,
  breakout: runBreakout,
};

renderMenu();
renderCharacters();
activeGame = games[0];
title.textContent = "\u8bf7\u9009\u62e9\u6e38\u620f";
kicker.textContent = "\u4e09\u4e3d\u9e25\u5bb6\u65cf";
setMessage("\u4ece\u83dc\u5355\u9009\u62e9\u4e00\u4e2a\u5c0f\u6e38\u620f\u5f00\u59cb\u3002");
openDrawer();
