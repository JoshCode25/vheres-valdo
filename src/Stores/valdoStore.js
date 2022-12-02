import { writable } from "svelte/store";
import getRandomValdoList from "../valdoList";

let valdoList = getRandomValdoList();

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function createValdoStore() {

    const valdoStore = writable({
        totalValdoList: valdoList,
        netValdoList: valdoList,
        activeValdo: {},
        displayedValdos: [],
        minDisplayedValdoNumber: 4,
        foundValdos: [],
        activatedGame: false,
        shuffleNetValdoList() {
            let shuffledNetValdoList = shuffleArray(this.netValdoList.slice());
            this.netValdoList = shuffledNetValdoList;
        },
        setActiveValdo() {
            //pick a random Valdo from the displayed to be the active/searched for Valdo
            this.activeValdo = this.displayedValdos[Math.floor(Math.random()*this.displayedValdos.length)];
        },
        setDisplayedValdos() {
            //shuffle netValdoList and reset the displayed and active Valdos
            this.shuffleNetValdoList();
            let newDisplayedValdos = this.netValdoList.slice(0, 2*this.foundValdos.length + this.minDisplayedValdoNumber);
            this.displayedValdos = newDisplayedValdos;
            this.setActiveValdo();
        },
        addFoundValdo() {
            //find and remove found Valdo from netList to prevent duplicates
            let activeIndex = this.netValdoList.findIndex(valdo => valdo.fullName === this.activeValdo.fullName);
            if (activeIndex !== -1) {
                let foundValdo = this.netValdoList.splice(activeIndex, 1);
                this.foundValdos = [...this.foundValdos, foundValdo];
                this.setDisplayedValdos();
                return
            }
            console.log(this.activeValdo, activeIndex)
        },
    })

    return {
        subscribe: valdoStore.subscribe,
        startNewGame: () => valdoStore.update(o => {
            o.activatedGame = true;
            o.foundValdos.length = 0;
            o.setDisplayedValdos();
            console.log(o);
            return o;
        }),
        startNewRound: () => valdoStore.update(o => {
            o.addFoundValdo();
            return o;
        }),
        finishGame: () => valdoStore.update(o => {
            o.activatedGame = false;
            o.totalValdoList = getRandomValdoList();
            o.netValdoList = o.totalValdoList;
            return o;
        })

    }
}

export const valdoStore = createValdoStore();