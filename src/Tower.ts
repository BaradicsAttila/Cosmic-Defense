export class Tower {
	Type: string;
	Towerdiv: HTMLDivElement;
	Level: number;
	Stats: number[];
	Placement: HTMLTableCellElement;
	Cost: number;
	Range: number;
	DefaultUpgradeCost: number;
	Interval: number;
	Firerate: number;
	InRange: boolean;
	LastShot: number;
	get Damage(): number {
		return this.Stats[0] * 1.6 ** (this.Level - 1);
	}
	get Upgradecost(): number {
		return Math.floor(this.Stats[3] * 1.55 ** (this.Level - 1));
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
		this.Firerate = this.Stats[1];
		this.Cost = this.Stats[2];
		this.Range = this.Stats[4];
		this.DefaultUpgradeCost = this.Stats[3];
		this.Placement = placement;
		this.Interval = 0;
		this.InRange = false;
		this.LastShot = 0;
		this.Towerdiv = document.createElement("div");
		if (coinamount >= this.Cost) {
			this.Towerdiv.classList.add("tower");
			this.Towerdiv.style.backgroundImage = `url(src/assets/${this.Type}Turet.png)`;
			this.Towerdiv.addEventListener("click", () => {
				if (callbackupgrade) {
					callbackupgrade(this);
					this.Towerdiv.innerHTML =
						"<span>Lvl: " +
						this.Level.toString() +
						"</span>" +
						"<span style='font-size: 12px; bottom: -10px;'>" +
						this.Upgradecost.toString() +
						"</span>";
				}
				if (calbackdemolish) {
					calbackdemolish(this);
				}
			});
			this.Towerdiv.innerHTML =
				"<span>Lvl: " +
				this.Level.toString() +
				"</span>" +
				"<span style='font-size: 12px; bottom: -10px;''>" +
				this.Upgradecost.toString() +
				"</span>";
			this.Placement.appendChild(this.Towerdiv);
		}
	}

	GetLevelMultiplier(): number[] {
		//damage, firerate, cost, upgradecost, range
		let stats: number[];
		switch (this.Type) {
			case "Blaster":
				stats = [20, 1000, 400, 300, 400];
				return stats;
			case "Shock":
				stats = [40, 2000, 1000, 700, 400];
				return stats;
			case "Sniper":
				stats = [100, 2000, 2000, 1200, 1000];
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
