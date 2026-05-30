export class Bulett {
	Type: string;
	Bulettdiv: HTMLDivElement;
	Damage: number;
    Range: number;

	constructor(type: string, damaage: number, range:number) {
		this.Type = type;
		this.Damage = damaage;
        this.Range = range
		this.Bulettdiv = document.createElement("div");
		this.Bulettdiv.classList.add("bulett");
		this.Bulettdiv.classList.add(type);
	}

	Destroy(): void {
		document.querySelector(".gameArea")?.removeChild(this.Bulettdiv);
	}
}
