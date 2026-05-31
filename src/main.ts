import "./style.css";
import { Enemy } from "./Enemy";
import { Tower } from "./Tower";
import { Bulett } from "./Bulett";

let wave: number = 0;
let enemys: Enemy[] = [];
let towers: Tower[] = [];
let buletts: Bulett[] = [];
let coins: number = 10000;
let gameInterval: number;
let health: number = 3;
let buildmode: boolean = false;
let upgrademode: boolean = false;
let destroymode: boolean = false;
let iswaverunning: boolean = false;
let enemysthiswave: number = 0;
let enemydefeatedthiswave: number = 0;
let spawnTimeouts: number[] = [];

const startBTN: HTMLButtonElement = document.querySelector(
	".startBTN",
) as HTMLButtonElement;
const coinSpan: HTMLSpanElement = document.querySelector(
	".coinSpan",
) as HTMLSpanElement;
coinSpan.innerHTML = coins.toString();
const portalLeft = window.getComputedStyle(
	document.querySelector(".endportal") as HTMLDivElement,
).left;
const buildmodediv: HTMLDivElement = document.querySelector(
	".buildmodediv",
) as HTMLDivElement;
const constructiondiv: HTMLDivElement = document.querySelector(
	".constructionsdiv",
) as HTMLDivElement;
const upgradediv: HTMLDivElement = document.querySelector(
	".upgradediv",
) as HTMLDivElement;
const destroydiv: HTMLDivElement = document.querySelector(
	".destroydiv",
) as HTMLDivElement;
const towrselecterdiv: HTMLDivElement = document.querySelector(
	".towerSeletor",
) as HTMLDivElement;
const cells = document.querySelectorAll(
	"td",
) as NodeListOf<HTMLTableCellElement>;
const selectableTowers = document.querySelectorAll(
	".towerselectdiv",
) as NodeListOf<HTMLDivElement>;
const gameArea: HTMLDivElement = document.querySelector(
	".gameArea",
) as HTMLDivElement;
const currentwavespan: HTMLSpanElement = document.querySelector(
	".currentWaveSpan",
) as HTMLSpanElement;
const highscoreSpan = document.querySelector(
	".highscoreSpan",
) as HTMLSpanElement;

highscoreSpan.innerHTML = localStorage.getItem("record") ?? "0";

startBTN.addEventListener("click", () => {
	if (startBTN.innerHTML == "Restart") {
		towers.forEach((t) => {
			t.Demolish();
		});
		coins = 10000;
		coinSpan.innerHTML = coins.toString();
		health = 3;
		(document.querySelector(".hartsdiv") as HTMLDivElement).style.width =
			"180px";
		towers = [];
	}
	WaveStarted();
	(document.querySelector(".startportal") as HTMLDivElement).style.opacity =
		"1";
	(document.querySelector(".endportal") as HTMLDivElement).style.opacity = "1";
	startBTN.style.display = "none";
});

function WaveStarted(): void {
	wave++;
	currentwavespan.innerHTML = wave.toString();
	iswaverunning = true;
	enemydefeatedthiswave = 0;
	enemysthiswave = Math.floor(23 * 1.2 ** (wave - 1));
	EnemySpawner();
	gameInterval = setInterval(() => {
		if (enemydefeatedthiswave >= enemysthiswave) {
			WaveOver();
		}
		towers.forEach((t) => {
			let towerRect = t.Towerdiv.getBoundingClientRect();
			let nowInRange = false;
			enemys.forEach((e) => {
				let er = e.EnemyDiv.getBoundingClientRect();
				if (
					Math.sqrt(
						(er.left - towerRect.left) ** 2 +
							(er.top - towerRect.top) ** 2,
					) < t.Range
				) {
					nowInRange = true;
				}
			});
			if (nowInRange && !t.InRange) {
				if (Date.now() - t.LastShot >= t.Firerate) {
					Bulettspawner(t);
				}
				t.Interval = setInterval(() => {
					Bulettspawner(t);
				}, t.Firerate);
			} else if (!nowInRange && t.InRange) {
				clearInterval(t.Interval);
				t.Interval = 0;
			}
			t.InRange = nowInRange;
		});
		let enemiesToRemove: Enemy[] = [];
		enemys.forEach((e) => {
			e.Move();
			if (
				Number(e.EnemyDiv.style.left.replace("px", "")) >=
				Number(portalLeft.replace("px", ""))
			) {
				enemiesToRemove.push(e);
			}
		});
		enemiesToRemove.forEach((e) => {
			let index: number = enemys.indexOf(e);
			enemys.splice(index, 1);
			e.Destroy();
			RemoveHart();
		});
		let bulletsToRemove: Bulett[] = [];
		buletts.forEach((b) => {
			let gameAreaRect = gameArea.getBoundingClientRect();
			let bulletRect = b.Bulettdiv.getBoundingClientRect();
			let bx = bulletRect.left - gameAreaRect.left;
			let by = bulletRect.top - gameAreaRect.top;
			if (!b.Target || !enemys.includes(b.Target)) {
				const targetable: { enemy: Enemy; distance: number }[] = [];
				enemys.forEach((e) => {
					const enemyRect = e.EnemyDiv.getBoundingClientRect();
					const ex = enemyRect.left - gameAreaRect.left;
					const ey = enemyRect.top - gameAreaRect.top;
					const distance = Math.sqrt((ex - bx) ** 2 + (ey - by) ** 2);
					if (distance < b.Range) targetable.push({ enemy: e, distance });
				});
				if (targetable.length > 0 && b.Type == "Shock") {
					targetable.forEach(({ enemy, distance }) => {
						setTimeout(
							() => {
								enemy.TakeDamage(b.Damage);
							},
							500 * (distance / b.Range),
						);
					});
					bulletsToRemove.push(b);
				}
				if (targetable.length == 0) {
					bulletsToRemove.push(b);
				}
				if (targetable.length > 0 && b.Type != "Shock") {
					let targeted: Enemy = targetable[0].enemy;
					targetable.forEach(({ enemy }) => {
						if (
							targeted.EnemyDiv.getBoundingClientRect().left <
							enemy.EnemyDiv.getBoundingClientRect().left
						) {
							targeted = enemy;
						}
					});
					b.Target = targeted;
				}
			}
			if (b.Target && b.Type != "Shock") {
				let tx =
					b.Target.EnemyDiv.getBoundingClientRect().left -
					gameAreaRect.left;
				let ty =
					b.Target.EnemyDiv.getBoundingClientRect().top - gameAreaRect.top;
				let dx = tx + 40 - bx;
				let dy = ty + 10 - by;
				let distance = Math.sqrt(dx ** 2 + dy ** 2);
				if (b.Type == "Blaster") {
					bx += (dx / distance) * 8;
					by += (dy / distance) * 8;
					b.Bulettdiv.style.left = bx.toString() + "px";
					b.Bulettdiv.style.top = by.toString() + "px";
					if (distance < 20) {
						b.Target.TakeDamage(b.Damage);
						bulletsToRemove.push(b);
					}
				} else {
					b.Bulettdiv.style.left = (bx + 20).toString() + "px";
					b.Bulettdiv.style.top = (by + 20).toString() + "px";
					b.Bulettdiv.style.height = distance.toString() + "px";
					b.Target.TakeDamage(b.Damage);
					bulletsToRemove.push(b);
					let angle = Math.atan2(dy, dx) * (180 / Math.PI) - 90;
					b.Bulettdiv.style.transformOrigin = "left top";
					b.Bulettdiv.style.transform = `rotate(${angle}deg)`;
					b.Bulettdiv.style.opacity = "0";
				}
			}
		});
		bulletsToRemove.forEach((b) => {
			RemoveBulett(b);
		});
		if (enemys.length == 0) {
			ClearBuletts();
		}
	}, 16);
}

function ClearBuletts(): void {
	buletts.forEach((b) => {
		if (gameArea.contains(b.Bulettdiv)) {
			gameArea.removeChild(b.Bulettdiv);
		}
	});
	buletts = [];
}

function RemoveBulett(b: Bulett): void {
	const index: number = buletts.indexOf(b);
	if (index === -1) return;
	buletts.splice(index, 1);

	if (b.Type === "Blaster") {
		if (gameArea.contains(b.Bulettdiv)) {
			gameArea.removeChild(b.Bulettdiv);
		}
	} else if (b.Type === "Shock") {
		setTimeout(() => {
			if (gameArea.contains(b.Bulettdiv)) {
				gameArea.removeChild(b.Bulettdiv);
			}
		}, 700);
	} else if (b.Type === "Sniper") {
		setTimeout(() => {
			if (gameArea.contains(b.Bulettdiv)) {
				gameArea.removeChild(b.Bulettdiv);
			}
		}, 250);
	}
}
function Bulettspawner(t: Tower): void {
	let gameAreaRect = gameArea.getBoundingClientRect();
	let towerRect = t.Towerdiv.getBoundingClientRect();
	let tx = towerRect.left;
	let ty = towerRect.top;
	let inrange = false;
	enemys.forEach((e) => {
		let er = e.EnemyDiv.getBoundingClientRect();
		if (Math.sqrt((er.left - tx) ** 2 + (er.top - ty) ** 2) < t.Range) {
			inrange = true;
		}
	});
	if (inrange) {
		t.LastShot = Date.now();
		let bulett = new Bulett(t);
		bulett.Bulettdiv.style.left = tx - gameAreaRect.left + 20 + "px";
		bulett.Bulettdiv.style.top = ty - gameAreaRect.top + "px";
		gameArea.appendChild(bulett.Bulettdiv);
		if (t.Type == "Shock") {
			bulett.Bulettdiv.style.left =
				(tx - gameAreaRect.left + 50).toString() + "px";
			bulett.Bulettdiv.style.top =
				(ty - gameAreaRect.top + 50).toString() + "px";
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					bulett.Bulettdiv.style.width = "800px";
					bulett.Bulettdiv.style.height = "800px";
				});
			});
			setTimeout(() => {
				bulett.Bulettdiv.style.opacity = "0";
			}, 400);
		}
		buletts.push(bulett);
	}
}
cells.forEach((c) => {
	c.addEventListener("click", () => {
		if (buildmode && !c.classList.contains("occupied")) {
			let type: string = (
				document.querySelector(".selelectedturet p") as HTMLDivElement
			).innerHTML;
			let newtower: Tower = new Tower(
				type,
				coins,
				(t: Tower) => Demolish(t),
				(t: Tower) => LevelUp(t),
				c,
			);
			if (coins >= newtower.Cost) {
				c.classList.add("occupied");
				coins -= newtower.Cost;
				coinSpan.innerHTML = coins.toString();
				towers.push(newtower);
			}
		}
	});
});

function LevelUp(t: Tower): void {
	let upgradeCost = t.Upgradecost;
	if (upgrademode && upgradeCost <= coins) {
		coins -= upgradeCost;
		t.Level++;

		coinSpan.innerHTML = coins.toString();
	}
}

function Demolish(t: Tower): void {
	if (destroymode) {
		let moneyback: number = t.Cost;
		if (t.Level > 1) {
			moneyback +=
				t.DefaultUpgradeCost * 2 ** (t.Level - 1) - t.DefaultUpgradeCost;
		}
		coins += moneyback;
		coinSpan.innerHTML = coins.toString();
		const index = towers.indexOf(t);
		if (index !== -1) {
			towers.splice(index, 1);
		}
		clearInterval(t.Interval);
		t.Demolish();
	}
}

function Killed(e: Enemy): void {
	let index: number = enemys.indexOf(e);
	if (index == -1) return;
	enemydefeatedthiswave++;
	enemys.splice(index, 1);
	e.Destroy();
	coins += Math.floor(e.Reward);
	coinSpan.innerHTML = coins.toString();
}

function EnemySpawner(): void {
	for (let i = 0; i < enemysthiswave; i++) {
		let id = window.setTimeout(
			() => {
				if (iswaverunning) {
					enemys.push(new Enemy((e: Enemy) => Killed(e), wave));
				}
			},
			i * (800 / 1.2 ** (wave - 1)),
		);
		spawnTimeouts.push(id);
	}
}

function RemoveHart(): void {
	health--;
	enemydefeatedthiswave++;
	(document.querySelector(".hartsdiv") as HTMLDivElement).style.width =
		(60 * health).toString() + "px";
	if (health <= 0) {
		GameOver();
	}
}

function WaveOver(): void {
	if (iswaverunning) {
		iswaverunning = false;
		spawnTimeouts.forEach((id) => clearTimeout(id));
		spawnTimeouts = [];
		SetRecord();
		ClearBuletts();
		towers.forEach((t) => {
			clearInterval(t.Interval);
			t.InRange = false;
		});
		startBTN.innerHTML = "Start Next Wave";
		startBTN.style.display = "block";
		clearInterval(gameInterval);
	}
}

function GameOver(): void {
	if (iswaverunning) {
		iswaverunning = false;
		spawnTimeouts.forEach((id) => clearTimeout(id));
		spawnTimeouts = [];
		clearInterval(gameInterval);
		ClearBuletts();
		towers.forEach((t) => {
			clearInterval(t.Interval);
		});
		enemys.forEach((e) => {
			if (gameArea.contains(e.EnemyDiv)) {
				gameArea.removeChild(e.EnemyDiv);
			}
		});
		enemys = [];
		wave = 0;
		startBTN.innerHTML = "Restart";
		startBTN.style.display = "block";
	}
}

function SetRecord(): void {
	let record = Number(localStorage.getItem("record"));
	if (wave > record) {
		localStorage.setItem("record", wave.toString());
		(document.querySelector(".highscoreSpan") as HTMLSpanElement).innerHTML =
			wave.toString();
	}
}
buildmodediv.addEventListener("click", () => {
	upgrademode = false;
	upgradediv.style.backgroundColor = "transparent";
	destroymode = false;
	destroydiv.style.backgroundColor = "transparent";
	if (buildmode) {
		buildmode = false;
		towrselecterdiv.style.display = "none";
		constructiondiv.style.opacity = "0";
		cells.forEach((c) => {
			c.style.border = "2px transparent solid";
		});
	} else {
		buildmode = true;
		towrselecterdiv.style.display = "flex";
		constructiondiv.style.opacity = "1";
		cells.forEach((c) => {
			c.style.border = "2px orange solid";
		});
	}
});

upgradediv.addEventListener("click", () => {
	buildmode = false;
	towrselecterdiv.style.display = "none";
	constructiondiv.style.opacity = "0";
	destroymode = false;
	destroydiv.style.backgroundColor = "transparent";
	cells.forEach((c) => {
		c.style.border = "2px transparent solid";
	});

	if (upgrademode) {
		upgrademode = false;
		upgradediv.style.backgroundColor = "transparent";
	} else {
		upgrademode = true;
		upgradediv.style.backgroundColor = "green";
	}
});

destroydiv.addEventListener("click", () => {
	buildmode = false;
	towrselecterdiv.style.display = "none";
	constructiondiv.style.opacity = "0";
	upgrademode = false;
	upgradediv.style.backgroundColor = "transparent";
	cells.forEach((c) => {
		c.style.border = "2px transparent solid";
	});

	if (destroymode) {
		destroymode = false;
		destroydiv.style.backgroundColor = "transparent";
	} else {
		destroymode = true;
		destroydiv.style.backgroundColor = "orange";
	}
});

selectableTowers.forEach((s) => {
	s.addEventListener("click", () => {
		selectableTowers.forEach((t) => {
			t.classList.remove("selelectedturet");
		});
		s.classList.add("selelectedturet");
	});
});
