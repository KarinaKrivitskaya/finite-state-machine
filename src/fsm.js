class FSM {

    constructor(config) {
        this.stateHistory = [].concat(config.initial);
        this.states = config.states;
        this.active = 0;
    }

    getState() {
        return this.stateHistory[this.active];
    }

    changeState(state) {
        if(this.states[state]){
            if(this.stateHistory[this.active] == state) return;
            this.active = this.stateHistory.length;
            this.stateHistory.push(state);
        }else throw new Error;
    }

    trigger(event) {
        if(this.states[this.stateHistory[this.active]].transitions[event]){
            if(this.active != this.stateHistory.length-1 && this.stateHistory[this.active+1]
                == this.states[this.stateHistory[this.active]].transitions[event]) this.active++;
            else this.stateHistory.push(this.states[this.stateHistory[this.active++]].transitions[event]);
        }else throw new Error;
    }

    reset() {
        this.active = 0;
    }

    getStates(event) {
        var result = [], states = [];
        for(var key in this.states){
            if(this.states[key].transitions[event]){
                result.push(key);
            }
            states.push(key);
        }
        return result.length == 0 ? arguments.length == 0 ? states : [] : result;
    }

    undo() {
        if(this.active-1 >= 0){
            --this.active;
            return true;
        } else  return false;
    }

    redo() {
        if(this.active+1 < this.stateHistory.length ){
            ++this.active;
            return true;
        } else  return false;
    }

    clearHistory() {
        this.stateHistory = [];
        this.active = 0;
    }
}

const config = {
    initial: 'normal',
    states: {
        normal: {
            transitions: {
                study: 'busy',
            }
        },
        busy: {
            transitions: {
                get_tired: 'sleeping',
                get_hungry: 'hungry',
            }
        },
        hungry: {
            transitions: {
                eat: 'normal'
            },
        },
        sleeping: {
            transitions: {
                get_hungry: 'hungry',
                get_up: 'normal',
            },
        },
    }
};

module.exports = FSM;

