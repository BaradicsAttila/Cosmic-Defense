export class Tower {
	Type: string;
	Towerdiv: HTMLDivElement;
	Level: number;
	Stats: number[];
	Placement: HTMLTableCellElement;
	Cost: number;
	Range:number;
	DefaultUpgradeCost: number;
	get Damage(): number {
		return this.Stats[0] * 1.5 ** (this.Level - 1);
	}
	get Firerate(): number {
		return this.Stats[1] / 1.5 ** (this.Level - 1);
	}
	get Upgradecost(): number {
		return this.Stats[3] * 2 ** (this.Level - 1);
	}

	constructor(
		type: string,
		coinamount: number,
		calbackdemolish: Function,
		callbackupgrade: Function,
		placement: HTMLTableCellElement,
	) {
		this.Type = type;
		this.Level = 1;
		this.Stats = this.GetLevelMultiplier();
		this.Cost = this.Stats[2];
		this.Range = this.Stats[4]
		this.DefaultUpgradeCost = this.Stats[3];
		this.Placement = placement;
		this.Towerdiv = document.createElement("div");
		if (coinamount >= this.Cost) {
			this.Towerdiv.classList.add("tower");
			this.Towerdiv.style.backgroundImage = `url(src/assets/${this.Type}Turet.png)`;
			this.Towerdiv.addEventListener("click", () => {
				if (callbackupgrade) {
					callbackupgrade(this);
					this.Towerdiv.innerHTML = "<span>Lvl: " + this.Level.toString()+"</span>";
				}
				if (calbackdemolish) {
					calbackdemolish(this);
				}
			});
			this.Towerdiv.innerHTML = "<span>Lvl: " + this.Level.toString()+"</span>";
			placement.appendChild(this.Towerdiv);
		}
	}

	GetLevelMultiplier(): number[] {
		let stats: number[];
		switch (this.Type) {
			case "Blaster":
				stats = [20, 500, 200, 200, 600];
				return stats;
			case "Shock":
				stats = [10, 1000, 500, 400, 400];
				return stats;
			case "Sniper":
				stats = [100, 2000, 1000, 800, 1200];
				return stats;

			default:
				return [];
		}
	}
	Demolish(): void {
		this.Placement.removeChild(this.Towerdiv);
		this.Placement.classList.remove("occupied");
	}
}
