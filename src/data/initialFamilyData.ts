import type { Person } from '../models/Person';
import type { Relationship } from '../models/Relationship';

export const initialPeople: Person[] = [
  { id: 'p1', name: 'Tự phúc Âm', gender: 'male', generation: 1, type: 'main', birthYear: null, deathYear: null, note: '' },
  { id: 'p2', name: 'Tự phúc Khánh', gender: 'male', generation: 2, type: 'main', birthYear: null, deathYear: null, note: '' },
  { id: 'p3', name: 'Tự phúc Thành', gender: 'male', generation: 3, type: 'main', birthYear: null, deathYear: null, note: '' },
  { id: 'p4', name: 'Tự phúc Chính', gender: 'male', generation: 4, type: 'main', birthYear: null, deathYear: null, note: '' },
  
  { id: 'p5', name: 'Tự phúc Thiện', gender: 'male', generation: 5, type: 'blue', birthYear: null, deathYear: null, note: '' },
  { id: 'p6', name: 'Tự phúc Như', gender: 'male', generation: 5, type: 'green', birthYear: null, deathYear: null, note: '' },
  
  { id: 'p7', name: 'Chi Ông Quý', gender: 'male', generation: 6, type: 'blue', birthYear: null, deathYear: null, note: '' },
  { id: 'p8', name: 'Chi ông Võ', gender: 'male', generation: 6, type: 'blue', birthYear: null, deathYear: null, note: '' },
  { id: 'p9', name: 'Tự phúc Tím', gender: 'male', generation: 6, type: 'blue', birthYear: null, deathYear: null, note: '' },
  { id: 'p10', name: 'Chi ông Bật', gender: 'male', generation: 6, type: 'green', birthYear: null, deathYear: null, note: '' },
  { id: 'p11', name: 'Chi ông Hạc', gender: 'male', generation: 6, type: 'green', birthYear: null, deathYear: null, note: '' },
  { id: 'p12', name: 'Chi ông Gia', gender: 'male', generation: 6, type: 'green', birthYear: null, deathYear: null, note: '' },

  { id: 'p13', name: 'Tự phúc Bằng', gender: 'male', generation: 7, type: 'main', birthYear: null, deathYear: null, note: '' },
  { id: 'p14', name: 'Tự phúc Trang', gender: 'male', generation: 8, type: 'main', birthYear: null, deathYear: null, note: '' },
  { id: 'p15', name: 'Tự phúc Thiết', gender: 'male', generation: 9, type: 'main', birthYear: null, deathYear: null, note: '' },

  { id: 'p16', name: 'Ông Đính', gender: 'male', generation: 10, type: 'main', birthYear: null, deathYear: null, note: '' },
  { id: 'p17', name: 'Ông Dương', gender: 'male', generation: 10, type: 'main', birthYear: null, deathYear: null, note: '' },

  { id: 'p18', name: 'Ông Tính', gender: 'male', generation: 11, type: 'blue', birthYear: null, deathYear: null, note: '' },
  { id: 'p19', name: 'Ông Sùi', gender: 'male', generation: 11, type: 'blue', birthYear: null, deathYear: null, note: '' },
  { id: 'p20', name: 'Ông Kha', gender: 'male', generation: 11, type: 'green', birthYear: null, deathYear: null, note: '' },
  { id: 'p21', name: 'Ông Muối', gender: 'male', generation: 11, type: 'green', birthYear: null, deathYear: null, note: '' },

  { id: 'p22', name: 'Ông Chí', gender: 'male', generation: 12, type: 'blue', birthYear: null, deathYear: null, note: '' },
  { id: 'p23', name: 'Ông Điền', gender: 'male', generation: 12, type: 'blue', birthYear: null, deathYear: null, note: '' },
  { id: 'p24', name: 'Ông Ngũ', gender: 'male', generation: 12, type: 'blue', birthYear: null, deathYear: null, note: '' },
  { id: 'p25', name: 'Ông Khê', gender: 'male', generation: 12, type: 'green', birthYear: null, deathYear: null, note: '' },

  { id: 'p26', name: 'Ông Lũng', gender: 'male', generation: 13, type: 'blue', birthYear: null, deathYear: null, note: '' },
  { id: 'p27', name: 'Ông Sũng', gender: 'male', generation: 13, type: 'blue', birthYear: null, deathYear: null, note: '' },
  { id: 'p28', name: 'Ông Xoay (Bố cô Dần)', gender: 'male', generation: 13, type: 'blue', birthYear: null, deathYear: null, note: '' },

  { id: 'p29', name: 'Ông Lợi', gender: 'male', generation: 14, type: 'blue', birthYear: null, deathYear: null, note: '' },
  { id: 'p30', name: 'Ông Lộc', gender: 'male', generation: 14, type: 'blue', birthYear: null, deathYear: null, note: '' },
  { id: 'p31', name: 'Nguyễn Đắc Canh', gender: 'male', generation: 14, type: 'red', birthYear: null, deathYear: null, note: '' },
  { id: 'p32', name: 'Nguyễn Đắc Xoảng', gender: 'male', generation: 14, type: 'red', birthYear: null, deathYear: null, note: '' },

  { id: 'p33', name: 'Vinh', gender: 'male', generation: 15, type: 'gold', birthYear: null, deathYear: null, note: '' },
  { id: 'p34', name: 'Đại', gender: 'male', generation: 15, type: 'gold', birthYear: null, deathYear: null, note: '' },
  { id: 'p35', name: 'Vương', gender: 'male', generation: 15, type: 'gold', birthYear: null, deathYear: null, note: '' },
  { id: 'p36', name: 'Cường', gender: 'male', generation: 15, type: 'red', birthYear: null, deathYear: null, note: '' },
  { id: 'p37', name: 'Hưởng', gender: 'male', generation: 15, type: 'red', birthYear: null, deathYear: null, note: '' },
  { id: 'p38', name: 'Điền', gender: 'male', generation: 15, type: 'red', birthYear: null, deathYear: null, note: '' },
  { id: 'p39', name: 'Lục', gender: 'male', generation: 15, type: 'red', birthYear: null, deathYear: null, note: '' },
  { id: 'p40', name: 'Lâm', gender: 'male', generation: 15, type: 'red', birthYear: null, deathYear: null, note: '' },
  { id: 'p41', name: 'Nguyễn Đắc Hải', gender: 'male', generation: 15, type: 'red', birthYear: null, deathYear: null, note: '' },

  { id: 'p42', name: 'Dũng', gender: 'male', generation: 16, type: 'gold', birthYear: null, deathYear: null, note: '' },
  { id: 'p43', name: 'Đạo', gender: 'male', generation: 16, type: 'gold', birthYear: null, deathYear: null, note: '' },
  { id: 'p44', name: 'Hậu', gender: 'male', generation: 16, type: 'red', birthYear: null, deathYear: null, note: '' },
  { id: 'p45', name: 'Huy', gender: 'male', generation: 16, type: 'red', birthYear: null, deathYear: null, note: '' },
  { id: 'p46', name: 'Hoàng', gender: 'male', generation: 16, type: 'red', birthYear: null, deathYear: null, note: '' },
  { id: 'p47', name: 'H.Anh', gender: 'male', generation: 16, type: 'red', birthYear: null, deathYear: null, note: '' },
  { id: 'p48', name: 'Bình', gender: 'male', generation: 16, type: 'red', birthYear: null, deathYear: null, note: '' },
  { id: 'p49', name: 'Nam', gender: 'male', generation: 16, type: 'red', birthYear: null, deathYear: null, note: '' },
  { id: 'p50', name: 'Duy', gender: 'male', generation: 16, type: 'red', birthYear: null, deathYear: null, note: '' },
  { id: 'p51', name: 'Đăng', gender: 'male', generation: 16, type: 'red', birthYear: null, deathYear: null, note: '' },
];

export const initialRelationships: Relationship[] = [
  { id: 'r1', type: 'parent-child', sourceId: 'p1', targetId: 'p2' },
  { id: 'r2', type: 'parent-child', sourceId: 'p2', targetId: 'p3' },
  { id: 'r3', type: 'parent-child', sourceId: 'p3', targetId: 'p4' },
  
  { id: 'r4', type: 'parent-child', sourceId: 'p4', targetId: 'p5' },
  { id: 'r5', type: 'parent-child', sourceId: 'p4', targetId: 'p6' },

  { id: 'r6', type: 'parent-child', sourceId: 'p5', targetId: 'p7' },
  { id: 'r7', type: 'parent-child', sourceId: 'p5', targetId: 'p8' },
  { id: 'r8', type: 'parent-child', sourceId: 'p5', targetId: 'p9' },
  
  { id: 'r9', type: 'parent-child', sourceId: 'p6', targetId: 'p10' },
  { id: 'r10', type: 'parent-child', sourceId: 'p6', targetId: 'p11' },
  { id: 'r11', type: 'parent-child', sourceId: 'p6', targetId: 'p12' },

  { id: 'r12', type: 'parent-child', sourceId: 'p9', targetId: 'p13' },
  { id: 'r13', type: 'parent-child', sourceId: 'p13', targetId: 'p14' },
  { id: 'r14', type: 'parent-child', sourceId: 'p14', targetId: 'p15' },

  { id: 'r15', type: 'parent-child', sourceId: 'p15', targetId: 'p16' },
  { id: 'r16', type: 'parent-child', sourceId: 'p15', targetId: 'p17' },

  { id: 'r17', type: 'parent-child', sourceId: 'p16', targetId: 'p18' },
  { id: 'r18', type: 'parent-child', sourceId: 'p16', targetId: 'p19' },

  { id: 'r19', type: 'parent-child', sourceId: 'p17', targetId: 'p20' },
  { id: 'r20', type: 'parent-child', sourceId: 'p17', targetId: 'p21' },

  { id: 'r21', type: 'parent-child', sourceId: 'p18', targetId: 'p22' },
  { id: 'r22', type: 'parent-child', sourceId: 'p18', targetId: 'p23' },
  { id: 'r23', type: 'parent-child', sourceId: 'p19', targetId: 'p24' },

  { id: 'r24', type: 'parent-child', sourceId: 'p20', targetId: 'p25' },

  { id: 'r25', type: 'parent-child', sourceId: 'p22', targetId: 'p26' },
  { id: 'r26', type: 'parent-child', sourceId: 'p23', targetId: 'p27' },
  { id: 'r27', type: 'parent-child', sourceId: 'p24', targetId: 'p28' },

  { id: 'r28', type: 'parent-child', sourceId: 'p26', targetId: 'p29' },
  { id: 'r29', type: 'parent-child', sourceId: 'p26', targetId: 'p30' },
  { id: 'r30', type: 'parent-child', sourceId: 'p28', targetId: 'p31' },
  { id: 'r31', type: 'parent-child', sourceId: 'p28', targetId: 'p32' },

  { id: 'r32', type: 'parent-child', sourceId: 'p29', targetId: 'p33' },
  { id: 'r33', type: 'parent-child', sourceId: 'p29', targetId: 'p34' },
  { id: 'r34', type: 'parent-child', sourceId: 'p29', targetId: 'p35' },
  
  { id: 'r35', type: 'parent-child', sourceId: 'p31', targetId: 'p36' },
  { id: 'r36', type: 'parent-child', sourceId: 'p31', targetId: 'p37' },
  { id: 'r37', type: 'parent-child', sourceId: 'p31', targetId: 'p38' },
  { id: 'r38', type: 'parent-child', sourceId: 'p31', targetId: 'p39' },
  { id: 'r39', type: 'parent-child', sourceId: 'p31', targetId: 'p40' },

  { id: 'r40', type: 'parent-child', sourceId: 'p32', targetId: 'p41' },

  { id: 'r41', type: 'parent-child', sourceId: 'p33', targetId: 'p42' },
  { id: 'r42', type: 'parent-child', sourceId: 'p33', targetId: 'p43' },

  { id: 'r43', type: 'parent-child', sourceId: 'p36', targetId: 'p44' },
  { id: 'r44', type: 'parent-child', sourceId: 'p37', targetId: 'p45' },
  { id: 'r45', type: 'parent-child', sourceId: 'p38', targetId: 'p46' },
  { id: 'r46', type: 'parent-child', sourceId: 'p39', targetId: 'p47' },
  { id: 'r47', type: 'parent-child', sourceId: 'p40', targetId: 'p48' },

  { id: 'r48', type: 'parent-child', sourceId: 'p41', targetId: 'p49' },
  { id: 'r49', type: 'parent-child', sourceId: 'p41', targetId: 'p50' },
  { id: 'r50', type: 'parent-child', sourceId: 'p41', targetId: 'p51' },
];
