import "./style.css";
import { Enemy } from "./Enemy";
import { Tower } from "./Tower";
import { Bulett } from "./Bulett";

export let wave: number = 0;
let enemys: Enemy[] = [];
let coins: number = 500;

const startBTN: HTMLDivElement = document.querySelector(
	".startBTN",
) as HTMLDivElement;
const coinsSpan: HTMLSpanElement = document.querySelector(".coinSpan") as HTMLSpanElement

startBTN.addEventListener


function KilledByTuret(e: Enemy): void {
	let index: number = enemys.indexOf(e);
	enemys.splice(index, 1);
	e.Destroy();
	coins += e.Reward;
	coinsSpan.innerHTML = coins.toString()
}
