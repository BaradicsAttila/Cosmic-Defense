import "./style.css";
import { Enemy } from "./Enemy";
import { Tower } from "./Tower";
import { Bulett } from "./Bulett";

let wave: number = 0;
let enemys: Enemy[] = [];
let towers: Tower[] = [];
let blasterbuletts: Bulett[] = [];
let coins: number = 10000;
let gameInterval: number;
let blasterInterval: number;
let shockInterval: number;
let sniperInterval: number;
let health: number = 3;
let buildmode: boolean = false;
let upgrademode: boolean = false;
let destroymode: boolean = false;

const startBTN: HTMLDivElement = document.querySelector(
	".startBTN",
) as HTMLDivElement;
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
) as NodeListOf<HTMLTableCellElement>;
const gameArea: HTMLDivElement = document.querySelector(
	".gameArea",
) as HTMLDivElement;

startBTN.addEventListener("click", () => {
	WaveStarted();
	(document.querySelector(".startportal") as HTMLDivElement).style.opacity =
		"1";
	(document.querySelector(".endportal") as HTMLDivElement).style.opacity = "1";
	startBTN.style.display = "none";
	startBTN.innerHTML = "Start Next Wave";
});

function WaveStarted(): void {
	wave++;
	EnemySpawner();
	blasterInterval = setInterval(() => {
		Bulettspawner("Blaster");
	}, 1000);

	gameInterval = setInterval(() => {
		enemys.forEach((e) => {
			e.Move();
			if (
				Number(e.EnemyDiv.style.left.replace("px", "")) >=
				Number(portalLeft.replace("px", ""))
			) {
				let index: number = enemys.indexOf(e);
				enemys.splice(index, 1);
				e.Destroy();
				RemoveHart();
			}
		});
		blasterbuletts.forEach((b) => {
			const gameAreaRect = gameArea.getBoundingClientRect();
			const bulletRect = b.Bulettdiv.getBoundingClientRect();
			let bx = bulletRect.left - gameAreaRect.left;
			let by = bulletRect.top - gameAreaRect.top;

			if (!b.Target || !enemys.includes(b.Target)) {
				let targetable: Enemy[] = [];
				enemys.forEach((e) => {
					const enemyRect = e.EnemyDiv.getBoundingClientRect();
					let ex = enemyRect.left - gameAreaRect.left;
					let ey = enemyRect.top - gameAreaRect.top;
					let distance = Math.sqrt((ex - bx) ** 2 + (ey - by) ** 2);
					if (distance < b.Range) targetable.push(e);
				});
				if (targetable.length > 0) {
					let targeted: Enemy = targetable[0];
					targetable.forEach((t) => {
						if (
							targeted.EnemyDiv.getBoundingClientRect().left <
							t.EnemyDiv.getBoundingClientRect().left
						) {
							targeted = t;
						}
					});
					b.Target = targeted;
				}
			}

			if (b.Target) {
				let tx =
					b.Target.EnemyDiv.getBoundingClientRect().left -
					gameAreaRect.left;
				let ty =
					b.Target.EnemyDiv.getBoundingClientRect().top - gameAreaRect.top;
				bx += (tx - bx) / 10;
				by += (ty - by) / 10;
				b.Bulettdiv.style.left = bx + "px";
				b.Bulettdiv.style.top = by + "px";
			}
		});
	}, 16);
}

function Bulettspawner(towertype: string) {
	towers.forEach((t) => {
		let inrange: boolean = false;
		let towerRect: DOMRect = t.Towerdiv.getBoundingClientRect();

		let tx: number = towerRect.left;
		let ty: number = towerRect.top;
		enemys.forEach((e) => {
			let enemyRect: DOMRect = e.EnemyDiv.getBoundingClientRect();
			let ex: number = enemyRect.left;
			let ey: number = enemyRect.top;
			let distance: number = Math.sqrt((ex - tx) ** 2 + (ey - ty) ** 2);
			if (distance < t.Range) {
				inrange = true;
			}
		});
		if (t.Type == towertype && inrange) {
			let bulett: Bulett = new Bulett(t.Type, t.Damage, t.Range);
			bulett.Bulettdiv.style.left = (tx + 20).toString() + "px";
			bulett.Bulettdiv.style.top = (ty - 80).toString() + "px";
			gameArea.appendChild(bulett.Bulettdiv);
			blasterbuletts.push(bulett);
		}
	});
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
	const upgradeCost = t.Upgradecost;
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
		t.Demolish();
	}
}

function Killed(e: Enemy): void {
	let index: number = enemys.indexOf(e);
	enemys.splice(index, 1);
	e.Destroy();
	coins += Math.floor(e.Reward);
	coinSpan.innerHTML = coins.toString();
}

function EnemySpawner(): void {
	let amountToSpawn: number = Math.floor(23 * 1.2 ** (wave - 1));
	for (let i = 0; i < amountToSpawn; i++) {
		setTimeout(
			() => {
				enemys.push(new Enemy((e: Enemy) => Killed(e), wave));
			},
			i * (800 / 1.2 ** (wave - 1)),
		);
	}
}

function RemoveHart(): void {
	health--;
	(document.querySelector(".hartsdiv") as HTMLDivElement).style.width =
		(60 * health).toString() + "px";
	if (health <= 0) {
		GameOver();
	}
}

function GameOver(): void {
	clearInterval(gameInterval);
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
