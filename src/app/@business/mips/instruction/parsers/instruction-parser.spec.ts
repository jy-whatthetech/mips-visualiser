import { RegisterInstructionParser } from './register-instruction-parser';
import { InstructionNotFoundException } from '../exceptions/instruction-not-found-exception';
import { RegisterNotFoundException } from '../exceptions/register-not-found-exception';
import { ImmediateInstructionParser } from './immediate-instruction-parser';

describe('Register instruction parser', () => {
    let parser: RegisterInstructionParser;

    beforeAll(() => {
        parser = new RegisterInstructionParser();
    });

    it('recognises R-type instruction', ()  => {
        const instruction1 = 'add $x, $y, $z';
        const instruction2 = 'ADD $x,$y,$z';
        const instruction3 = 'AdD $x,      $y, $z';

        expect(parser.match(instruction1)).toBe(true);
        expect(parser.match(instruction2)).toBe(true);
        expect(parser.match(instruction3)).toBe(true);
    });

    it('dismisses instructions of inappropriate type', ()  => {
        const instruction1 = 'lw $x, 1024($y)';
        const instruction2 = 'jal 2048';
        const instruction3 = 'beq $x, $y, 1024';

        expect(parser.match(instruction1)).toBe(false);
        expect(parser.match(instruction2)).toBe(false);
        expect(parser.match(instruction3)).toBe(false);
    });

    it('parses R-type instruction', () => {
        const instruction = 'add $1, $2, $3';
        const binary = '000000,00001,00010,00011,00000,000000';

        expect(parser.parse(instruction).length).toBe(32);
        expect(parser.parse(instruction)).toBe(binary.replace(/,/g, ''));
    });

    it('parses R-type instruction with register aliases', () => {
        const instruction = 'add $v0, $1, $v1';
        const binary = '000000,00010,00001,00011,00000,000000';

        expect(parser.parse(instruction)).toBe(binary.replace(/,/g, ''));
    });

    it('throws exception if instruction is not found', () => {
        const instruction = 'nope $1, $2, $3';

        expect(() => parser.parse(instruction)).toThrow(new InstructionNotFoundException('nope $1, $2, $3'));
    });

    it('throws exception if register is not found', () => {
        const instruction = 'add $1, $nope, $3';

        expect(() => parser.parse(instruction)).toThrow(new RegisterNotFoundException('$nope'));
    });
});

describe('Immediate instruction parser', () => {
    let parser: ImmediateInstructionParser;

    beforeAll(() => {
        parser = new ImmediateInstructionParser();
    });

    it('recognizes I-type instructions', ()  => {
        const instruction1 = 'addi $1, $2, 15';
        const instruction2 = 'addi $2, $3, -145';
        const instruction3 = 'addi $v0, $v1, +76';

        expect(parser.match(instruction1)).toBe(true);
        expect(parser.match(instruction2)).toBe(true);
        expect(parser.match(instruction3)).toBe(true);
    });

    it('dismisses instructions of inappropriate type', ()  => {
        const instruction1 = 'add $1, $2, $3';
        const instruction2 = 'j 5096';
        const instruction3 = 'sw $x, 0($y)';

        expect(parser.match(instruction1)).toBe(false);
        expect(parser.match(instruction2)).toBe(false);
        expect(parser.match(instruction3)).toBe(false);
    });

    it('parses I-type instruction', () => {
        const instruction = 'addi $1, $v1, 15';
        const binary = '001000,00001,00011,0000000000001111';

        expect(parser.parse(instruction)).toBe(binary.replace(/,/g, ''));
    });
});