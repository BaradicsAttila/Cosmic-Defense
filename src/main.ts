import "./style.css";
import { Enemy } from "./Enemy";
import { Tower } from "./Tower";
import { Bulett } from "./Bulett";

export let wave: number = 0;
let enemys: Enemy[] = [];
let coins: number = 500;
let spawnInterval: number;

const startBTN: HTMLDivElement = document.querySelector(
	".startBTN",
) as HTMLDivElement;
const coinsSpan: HTMLSpanElement = document.querySelector(
	".coinSpan",
) as HTMLSpanElement;

coinsSpan.innerHTML = coins.toString();
startBTN.addEventListener("click", () => {
	(document.querySelector(".startportal") as HTMLDivElement).style.opacity =
		"1";
	(document.querySelector(".endportal") as HTMLDivElement).style.opacity = "1";
	EnemySpawner();
	startBTN.style.display = "none";
	spawnInterval = setInterval(() => {
		enemys.forEach((e) => {
			e.Move();
		}, 16);
	});
});

function Killed(e: Enemy): void {
	let index: number = enemys.indexOf(e);
	enemys.splice(index, 1);
	e.Destroy();
	coins += e.Reward;
	coinsSpan.innerHTML = coins.toString();
}

function EnemySpawner(): void {
	let amountToSpawn: number = Math.floor(23 * 1.2 ** (wave - 1));
	for (let i = 0; i < amountToSpawn; i++) {
		setTimeout(
			() => {
				enemys.push(new Enemy((e: Enemy) => Killed(e)));
			},
			i * (400 / 1.2 ** (wave - 1)),
		);
	}
}
