export class Tower {
	Type: string;
	Towerdiv: HTMLDivElement;
	Level: number;
	Stats: number[];
	get Damage(): number {
		return this.Stats[0] * 1.5 ** (this.Level - 1);
	}
	get Firerate(): number {
		return this.Stats[1] / 1.5 ** (this.Level - 1);
	}
	get Cost(): number {
		return this.Stats[2];
	}
	get Upgradecost(): number {
		return this.Stats[3] * 2 ** (this.Level - 1);
	}

	constructor(
		type: string,
		callbackupgrade: Function,
		placement: HTMLTableCellElement,
	) {
		this.Type = type;
		this.Level = 1;
		this.Stats = this.GetLevelMultiplier();
		this.Towerdiv = document.createElement("div");
		this.Towerdiv.classList.add("tower");
		this.Towerdiv.style.backgroundImage = `url(src/assets/${this.Type}Turet.png)`;
		this.Towerdiv.addEventListener("click", () => {
			if (callbackupgrade) {
				callbackupgrade(this);
			}
		});
		placement.appendChild(this.Towerdiv);
	}

	GetLevelMultiplier(): number[] {
		let stats: number[];
		switch (this.Type) {
			case "Blaster":
				stats = [20, 500, 250, 200];
				return stats;
			case "Shock":
				stats = [10, 200, 500, 400];
				return stats;
			case "Sniper":
				stats = [100, 2000, 1000, 800];
				return stats;

			default:
				return [];
		}
	}
}
