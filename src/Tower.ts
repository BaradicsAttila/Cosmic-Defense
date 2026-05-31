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
	InRange : boolean;
	LastShot : number;
	get Damage(): number {
		return this.Stats[0] * 1.5 ** (this.Level - 1);
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
						"<span>Lvl: " + this.Level.toString() + "</span>";
				}
				if (calbackdemolish) {
					calbackdemolish(this);
				}
			});
			this.Towerdiv.innerHTML =
				"<span>Lvl: " + this.Level.toString() + "</span>";
			this.Placement.appendChild(this.Towerdiv);
		}
	}

	GetLevelMultiplier(): number[] {
		let stats: number[];
		switch (this.Type) {
			case "Blaster":
				stats = [20, 1000, 200, 200, 400];
				return stats;
			case "Shock":
				stats = [25, 2000, 500, 400, 400];
				return stats;
			case "Sniper":
				stats = [100, 3000, 1000, 800, 1000];
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
