import { Clock } from '../clock';
import { CPU } from '../../cpu/cpu';
import { BinaryEncoder } from '../../library/binary-encoder/binary-encoder';

export class ClockVII  implements Clock
{
    protected _encoder: BinaryEncoder;

    public constructor ()
    {
        this._encoder = new BinaryEncoder();
    }

    public execute (cpu: CPU): void
    {
        this.setControl(cpu);
        this.readData(cpu);
    }

    protected setControl (cpu: CPU): void
    {
        cpu.control.memRead = '1';
        cpu.control.lorD = '1';
    }

    protected readData (cpu: CPU): void
    {
        cpu.register('$memData').value = cpu.memory.get(cpu.alu.result);
    }
}