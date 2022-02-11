class Battle {
  constructor() {
    this.combatants = {
      player1: new Combatant(
        {
          hp: 50,
          maxHp: 50,
          xp: 0,
          level: 1,
          status: null,
        },
        this
      ),
    };
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = `
              <div class="Battle_hero">
                  <img src="${`/images/characters/people/hero.png`}" alt="Hero" />
              </div>
              <div class="Battle_enemy">
                  <img src="${`/images/characters/people/npc3.png`}" alt="Enemy" />
              </div>
          `;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}
