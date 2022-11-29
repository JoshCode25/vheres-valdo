import { writable } from "svelte/store";
import valdoList from "../valdoList";

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
        foundValdos: []
    })

    return {
        subscribe: valdoStore.subscribe,
        startNewGame: () => valdoStore.update(o => {
            o.setDisplayedValdos();
            return o;
        }),
        startNewRound: () => valdoStore.update(o => {
            o.addFoundValdo();
            return o;
        }),
        addFoundValdo: () => valdoStore.update(o => {
            //find and remove found Valdo from netList to prevent duplicates
            let activeIndex = o.netValdoList.findIndex(valdo => {
                valdo.name === o.activeValdo.name;
            })
            let foundValdo = o.netValdoList.splice(activeIndex, 1);
            o.foundValdos.push(foundValdo);
            o.setDisplayedValdos();
            return o;
        }),
        setDisplayedValdos: () => valdoStore.update(o => {
            //shuffle netValdoList and reset the displayed and active Valdos
            o.shuffleNetValdoList();
            o.displayedValdos = o.netValdoList.slice(0, 2*(o.foundValdos.length + 1));
            o.setActiveValdo();
            return o;
        }),
        setActiveValdo: () => valdoStore.update(o => {
            //pick a random Valdo from the displayed to be the active/searched for Valdo
            o.activeValdo = o.displayedValdos[Math.floor(Math.random()*o.displayedValdos.length)];
            return o;
        }),
        shuffleNetValdoList: () => valdoStore.update(o => {
            let shuffledNetValdoList = shuffleArray(o.netValdoList.slice());
            o = {...o, netValdoList: shuffledNetValdoList}
            return o;
        })

    }
}

export const valdoStore = createValdoStore();