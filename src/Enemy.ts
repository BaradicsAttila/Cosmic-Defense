import { wave } from "./main";

export class Enemy {
	callback: Function;
	Type!: string;
	Hp!: number;
	Speed!: number;
	Reward!: number;
	EnemyDiv: HTMLDivElement;

	constructor(callBackDied: Function) {
		this.callback = callBackDied;
		this.SetAttributes();
		this.EnemyDiv = document.createElement("div");
		this.EnemyDiv.classList.add("enemy");
		this.EnemyDiv.style.backgroundImage = `url(src/assets/${this.Type}Enemy.png)`;

		this.EnemyDiv.addEventListener("click", () => {
			this.TakeDamage(2);
		});
		document.querySelector(".gameArea")?.appendChild(this.EnemyDiv);
		this.EnemyDiv.style.left = "150px";
		this.EnemyDiv.style.opacity = "1";
	}

	SetAttributes(): void {
		let availableTypes: string[] = ["Blue"];
		if (wave > 2) availableTypes.push("Green");
		if (wave > 5) availableTypes.push("Yellow");
		if (wave > 10) availableTypes.push("Red");

		this.Type =
			availableTypes[Math.floor(Math.random() * availableTypes.length)];

		if (this.Type === "Red") {
			this.Speed = 1 * 1.1 ** (wave - 1);
			this.Hp = 200 * 1.3 ** (wave - 1);
			this.Reward = 300 * 1.1 ** (wave - 1);
		} else if (this.Type === "Yellow") {
			this.Speed = 2 * 1.1 ** (wave - 1);
			this.Hp = 50 * 1.3 ** (wave - 1);
			this.Reward = 200 * 1.1 ** (wave - 1);
		} else if (this.Type === "Green") {
			this.Speed = 0.5 * 1.1 ** (wave - 1);
			this.Hp = 200 * 1.3 ** (wave - 1);
			this.Reward = 150 * 1.1 ** (wave - 1);
		} else {
			this.Speed = 1 * 1.1 ** (wave - 1);
			this.Hp = 100 * 1.3 ** (wave - 1);
			this.Reward = 100 * 1.1 ** (wave - 1);
		}
	}

	TakeDamage(amount: number): void {
		this.Hp -= amount;
		if (this.Hp <= 0) {
			if (this.callback) this.callback(this);
		}
	}

	Destroy(): void {
		document.querySelector("#gameArea")?.removeChild(this.EnemyDiv);
	}

	Move(): void {
		let position: number = Number(this.EnemyDiv.style.left.replace("px", ""));
		this.EnemyDiv.style.left = (position += 1 * this.Speed).toString() + "px";
	}
}
