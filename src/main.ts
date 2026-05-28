import "./style.css";
import { Enemy } from "./Enemy";
import { Tower } from "./Tower";
import { Bulett } from "./Bulett";

export let wave: number = 0;
let enemys: Enemy[] = [];
let coins: number = 1000;
let spawnInterval: number;
let health: number = 3;
let buildmode: boolean = false;

const startBTN: HTMLDivElement = document.querySelector(
	".startBTN",
) as HTMLDivElement;
const coinSpan: HTMLSpanElement = document.querySelector(
	".coinSpan",
) as HTMLSpanElement;
const portalLeft = window.getComputedStyle(
	document.querySelector(".endportal") as HTMLDivElement,
).left;
const buildmodediv: HTMLDivElement = document.querySelector(
	".buildmodediv",
) as HTMLDivElement;
const constructiondiv: HTMLDivElement = document.querySelector(
	".constructionsdiv",
) as HTMLDivElement;

buildmodediv.addEventListener("click", () => {
	if (buildmode) {
		buildmode = false;
		constructiondiv.style.opacity = "0";
	} else {
		buildmode = true;
		constructiondiv.style.opacity = "1";
	}
});
coinSpan.innerHTML = coins.toString();
startBTN.addEventListener("click", () => {
	WaveStarted();
	(document.querySelector(".startportal") as HTMLDivElement).style.opacity =
		"1";
	(document.querySelector(".endportal") as HTMLDivElement).style.opacity = "1";
	startBTN.style.display = "none";
});

function WaveStarted(): void {
	wave++;
	EnemySpawner();
	spawnInterval = setInterval(() => {
		enemys.forEach((e) => {
			e.Move();
			console.log("asdsad");
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
	}, 16);
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
				enemys.push(new Enemy((e: Enemy) => Killed(e)));
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
	clearInterval(spawnInterval);
}
