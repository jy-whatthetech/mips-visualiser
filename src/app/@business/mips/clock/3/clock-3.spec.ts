import { CPU } from '../../cpu/cpu';
import { InstructionFactory } from '../../instruction/factories/instruction-factory';
import { Clock3 } from './clock-3';
import { BinaryEncoder } from '../../library/binary-encoder/binary-encoder';
import config from '../../library/config';

describe('Clock 3', () => {
    let cpu: CPU = null;
    const encoder: BinaryEncoder = new BinaryEncoder();

    beforeAll(() => cpu = new CPU());

    it('sets the CPU control signals', () => {
        const instruction = InstructionFactory.fromSymbolic('add $1, $2, $3');
        const spy = spyOnProperty(instruction, 'clocks').and.returnValue([new Clock3()]);

        cpu.simulate(instruction);
        cpu.nextClock();

        expect(spy).toHaveBeenCalled();
        expect(cpu.control.aluSelA).toBe('1');
        expect(cpu.control.aluSelB).toBe('10');
        expect(cpu.control.aluOp).toBe('00');
    });

    it('calculates memory address', () => {
        const instruction = InstructionFactory.fromSymbolic('lw $1, 128($2)');
        const spy = spyOnProperty(instruction, 'clocks').and.returnValue([new Clock3()]);

        cpu.register('$2').value = encoder.binary(1000, config.word_length);
        cpu.simulate(instruction);
        cpu.nextClock();

        expect(spy).toHaveBeenCalled();
        expect(cpu.alu.result).toBe(encoder.binary(1000 + 128, config.word_length));
    });
});