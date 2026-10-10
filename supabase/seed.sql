-- Supabase Seed Data for Teacher's Pet
-- File: supabase/seed.sql

-- Clear existing data cleanly
TRUNCATE TABLE public.grades, public.assessments, public.students, public.calendar_events, public.lesson_plans, public.classes CASCADE;

-- 1. Classes
INSERT INTO public.classes (id, name, grade_level, section, subject, school_year, created_at, updated_at) VALUES
('a0000000-0000-0000-0000-000000000001', 'Grade 10 - Newton (Physics)', '10', 'Newton', 'Physics', '2025-2026', NOW(), NOW()),
('a0000000-0000-0000-0000-000000000002', 'Grade 9 - Euclid (Geometry)', '9', 'Euclid', 'Mathematics', '2025-2026', NOW(), NOW());

-- 2. Students
-- Class 1: Grade 10 - Newton
INSERT INTO public.students (id, class_id, student_id_number, first_name, last_name, gender, email, contact_number, notes, created_at, updated_at) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'STU-10-001', 'Alex', 'Morgan', 'Male', 'alex.morgan@school.edu', '+1-555-0101', 'Exceptional problem-solving skills; active during lab inquiries.', NOW(), NOW()),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'STU-10-002', 'Beatriz', 'Santos', 'Female', 'beatriz.santos@school.edu', '+1-555-0102', 'Class representative; highly organized and collaborative.', NOW(), NOW()),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'STU-10-003', 'Caleb', 'Chen', 'Male', 'caleb.chen@school.edu', '+1-555-0103', 'Strong robotics background; intuitive grasp of mechanics.', NOW(), NOW()),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'STU-10-004', 'Diana', 'Prince', 'Female', 'diana.prince@school.edu', '+1-555-0104', 'Consistently meticulous with mathematical derivations.', NOW(), NOW()),
('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'STU-10-005', 'Ethan', 'Brooks', 'Male', 'ethan.brooks@school.edu', '+1-555-0105', 'Benefits from step-by-step guidance on vector algebra.', NOW(), NOW()),
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'STU-10-006', 'Fiona', 'Gallagher', 'Female', 'fiona.gallagher@school.edu', '+1-555-0106', 'Great lab team lead; shows steady improvement.', NOW(), NOW()),
('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'STU-10-007', 'Gabriel', 'Vance', 'Male', 'gabriel.vance@school.edu', '+1-555-0107', 'Strong conceptual grasp, occasionally rushes through calculation steps.', NOW(), NOW()),
('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'STU-10-008', 'Hannah', 'Kim', 'Female', 'hannah.kim@school.edu', '+1-555-0108', 'Transferred in Q1; caught up quickly and performs strongly.', NOW(), NOW());

-- Class 2: Grade 9 - Euclid
INSERT INTO public.students (id, class_id, student_id_number, first_name, last_name, gender, email, contact_number, notes, created_at, updated_at) VALUES
('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000002', 'STU-09-001', 'Ian', 'Wright', 'Male', 'ian.wright@school.edu', '+1-555-0201', 'High spatial reasoning aptitude; excels at geometric proofs.', NOW(), NOW()),
('b0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000002', 'STU-09-002', 'Julia', 'Romero', 'Female', 'julia.romero@school.edu', '+1-555-0202', 'Diligent notes and stellar homework completion record.', NOW(), NOW()),
('b0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000002', 'STU-09-003', 'Kevin', 'Patel', 'Male', 'kevin.patel@school.edu', '+1-555-0203', 'Fast mental math; working on writing formal two-column proofs.', NOW(), NOW()),
('b0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000002', 'STU-09-004', 'Luna', 'Alvarez', 'Female', 'luna.alvarez@school.edu', '+1-555-0204', 'Visual thinker; creates beautiful geometric construction diagrams.', NOW(), NOW()),
('b0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000002', 'STU-09-005', 'Marcus', 'Thorne', 'Male', 'marcus.thorne@school.edu', '+1-555-0205', 'Eager participant in board demonstrations and peer tutoring.', NOW(), NOW()),
('b0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000002', 'STU-09-006', 'Nadia', 'Hassan', 'Female', 'nadia.hassan@school.edu', '+1-555-0206', 'Thorough and detail-oriented in angle theorem exercises.', NOW(), NOW());

-- 3. Assessments
-- Class 1 Assessments
INSERT INTO public.assessments (id, class_id, title, type, total_points, weight_percentage, assessment_date, created_at, updated_at) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Quiz 1: Kinematics & Velocity Vectors', 'quiz', 25, 15, '2026-09-15 09:00:00+00', NOW(), NOW()),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Quiz 2: Newton''s Laws of Motion', 'quiz', 30, 15, '2026-09-29 09:00:00+00', NOW(), NOW()),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Midterm Exam: Classical Mechanics', 'exam', 100, 40, '2026-10-08 08:30:00+00', NOW(), NOW()),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Lab Performance Task: Projectile Trajectory', 'performance_task', 50, 30, '2026-10-18 10:00:00+00', NOW(), NOW());

-- Class 2 Assessments
INSERT INTO public.assessments (id, class_id, title, type, total_points, weight_percentage, assessment_date, created_at, updated_at) VALUES
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 'Quiz 1: Triangle Congruence Postulates', 'quiz', 20, 20, '2026-09-20 10:30:00+00', NOW(), NOW()),
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'Quarter 1 Exam: Euclidean Geometry', 'exam', 100, 50, '2026-10-05 10:00:00+00', NOW(), NOW()),
('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002', 'Performance Task: Geometric Scale Modeling', 'performance_task', 50, 30, '2026-10-22 13:00:00+00', NOW(), NOW());

-- 4. Grades
-- Class 1 - Quiz 1 (25 pts)
INSERT INTO public.grades (id, assessment_id, student_id, score, feedback, submitted_at, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 24, 'Superb vector resolution and notation.', '2026-09-15 10:00:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 23, 'Very clean calculations, missed only minor sign convention.', '2026-09-15 10:00:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 25, 'Flawless work across all parts!', '2026-09-15 10:00:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 25, 'Perfect execution and clearly labeled units.', '2026-09-15 10:00:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 18, 'Remember to double check acceleration direction in free-fall.', '2026-09-15 10:00:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 21, 'Good work on graph interpretation, keep reviewing formulas.', '2026-09-15 10:00:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007', 22, 'Solid effort. Be careful with unit conversion.', '2026-09-15 10:00:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000008', 20, 'Well done catching up on material quickly.', '2026-09-15 10:00:00+00', NOW(), NOW());

-- Class 1 - Midterm Exam (100 pts)
INSERT INTO public.grades (id, assessment_id, student_id, score, feedback, submitted_at, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 96, 'Mastery demonstrated across all mechanics sections.', '2026-10-08 10:30:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 91, 'Strong free-body diagrams and clear reasoning.', '2026-10-08 10:30:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 98, 'Exceptional performance on complex friction questions.', '2026-10-08 10:30:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 99, 'Top of class score. Brilliant analytical approach.', '2026-10-08 10:30:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000005', 76, 'Showed significant growth in Newton''s second law application.', '2026-10-08 10:30:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000006', 85, 'Solid grasp of fundamental principles.', '2026-10-08 10:30:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000007', 88, 'Good solutions, work on writing units next to each intermediate line.', '2026-10-08 10:30:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000008', 84, 'Strong comeback on mechanical energy conservation problems.', '2026-10-08 10:30:00+00', NOW(), NOW());

-- Class 2 - Quiz 1 (20 pts)
INSERT INTO public.grades (id, assessment_id, student_id, score, feedback, submitted_at, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 20, 'Perfect proof logic on SAS and SSS criteria.', '2026-09-20 11:15:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000010', 19, 'Very clear column format, great justification statements.', '2026-09-20 11:15:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000011', 17, 'Great conclusions, ensure all given statements are properly stated.', '2026-09-20 11:15:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000012', 19, 'Precise sketches and correct theorem citations.', '2026-09-20 11:15:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000013', 18, 'Good demonstration of AAS theorem.', '2026-09-20 11:15:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000014', 19, 'Well structured reasoning from hypothesis to conclusion.', '2026-09-20 11:15:00+00', NOW(), NOW());

-- Class 2 - Q1 Exam (100 pts)
INSERT INTO public.grades (id, assessment_id, student_id, score, feedback, submitted_at, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000009', 95, 'High analytical rigor throughout proofs section.', '2026-10-05 11:45:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000010', 92, 'Neat and logically coherent solutions.', '2026-10-05 11:45:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000011', 86, 'Solid understanding of complementary and supplementary angle theorems.', '2026-10-05 11:45:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000026', 'c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000012', 90, 'Clear geometric modeling and theorem usage.', '2026-10-05 11:45:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000027', 'c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000013', 88, 'Good step-by-step clarity in deductions.', '2026-10-05 11:45:00+00', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000028', 'c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000014', 94, 'Near-perfect execution on parallel lines proofs.', '2026-10-05 11:45:00+00', NOW(), NOW());

-- 5. Calendar Events
INSERT INTO public.calendar_events (id, class_id, title, description, event_type, start_time, end_time, location, is_all_day, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Physics Lab: Projectile Trajectory Exploration', 'Hands-on lab with photo-gate timers and angled launcher apparatus.', 'lesson', '2026-10-14 09:00:00+00', '2026-10-14 10:30:00+00', 'Science Lab 3B', FALSE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Quiz 3: Circular Motion & Gravitational Fields', 'Formative assessment covering centripetal acceleration and Kepler''s laws.', 'quiz', '2026-10-16 09:00:00+00', '2026-10-16 09:45:00+00', 'Room 204', FALSE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Lab Report Deadline: Projectile Motion Data Analysis', 'Final submission of parsed sensor data and error calculations on portal.', 'deadline', '2026-10-19 23:59:00+00', '2026-10-19 23:59:00+00', 'Online Submission', FALSE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'Geometry Proofs Interactive Workshop', 'Collaborative whiteboard session proving quadrilaterals and parallelogram properties.', 'lesson', '2026-10-15 10:30:00+00', '2026-10-15 12:00:00+00', 'Room 108', FALSE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 'Scale Model Geometric Blueprint Deadline', 'Submission of 1:50 architectural scale blueprint drawings and proofs.', 'deadline', '2026-10-22 17:00:00+00', '2026-10-22 17:00:00+00', 'Room 108', FALSE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000006', NULL, 'STEM Faculty Curriculum Alignment Meeting', 'Department sync on cross-subject calculus and physics curriculum integration.', 'meeting', '2026-10-13 14:00:00+00', '2026-10-13 15:30:00+00', 'Faculty Conference Room A', FALSE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000007', NULL, 'Mid-Semester Teacher Development & Planning Day', 'School-wide educator development workshops and grading sync.', 'holiday', '2026-10-24 00:00:00+00', '2026-10-24 23:59:59+00', 'Campus-Wide', TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000008', NULL, 'Parent-Teacher Conferences (Q1 Progress Review)', 'One-on-one progress discussions and report card reviews with guardians.', 'meeting', '2026-10-27 13:00:00+00', '2026-10-27 17:30:00+00', 'Main Auditorium', FALSE, NOW(), NOW());

-- 6. Lesson Plans
INSERT INTO public.lesson_plans (id, class_id, title, subject, grade_level, unit, target_date, duration_minutes, objectives, materials, procedure, assessment, notes, status, created_at, updated_at) VALUES
('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Newton''s Third Law & Action-Reaction Pairs', 'Physics', '10', 'Unit 2: Dynamics & Forces', '2026-10-12', 60,
'1. Identify action and reaction force pairs in real-world physical systems.
2. Differentiate between balanced forces acting on a single object versus action-reaction pairs acting on interacting bodies.
3. Apply F_A = -F_B to calculate recoil and contact force magnitudes.',
'Whiteboard, skateboard/rolling carts, spring scales, Pasco digital force sensors.',
'1. Hook (10m): Skateboard push against wall demonstration.
2. Direct Instruction (20m): Formal definition of Third Law, Free-Body Diagram isolation.
3. Guided Practice (15m): Spring scale tug-of-war readings in pairs.
4. Independent Problem Set (10m): 3 multi-body contact calculation questions.
5. Exit Ticket (5m): Explain why a horse can pull a cart despite equal and opposite forces.',
'5-minute exit ticket and guided worksheet check.',
'Remind students that action-reaction forces NEVER act on the same object.',
'completed', NOW(), NOW()),

('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Work-Energy Theorem & Kinetic Energy', 'Physics', '10', 'Unit 3: Energy, Work & Power', '2026-10-14', 60,
'1. Define mechanical work as the dot product of force and displacement vectors.
2. Derive the Work-Energy theorem from kinematic equations: W_net = ΔK.
3. Solve for final velocities given variable work inputs.',
'PhET Interactive Simulation (The Ramp & Energy), student laptops, printed problem sheets.',
'1. Review & Warmup (10m): Kinetic energy formula review and units (Joules).
2. Mini-Lecture (15m): Derivation of W = F * d * cos(theta) and net work connection to speed change.
3. Simulation Lab (20m): Students manipulate friction and incline angles on PhET simulator.
4. Paired Discussion (10m): Compare calculated values with simulator readout.
5. Wrap-up (5m): Preview gravitational potential energy.',
'Formative peer rubric on simulation data collection table.',
'Ensure Caleb and Ethan team up with peer coaches for formula derivations.',
'ready', NOW(), NOW()),

('f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'Parallel Lines cut by a Transversal: Angle Theorems', 'Mathematics', '9', 'Unit 2: Geometric Proofs', '2026-10-15', 60,
'1. Identify alternate interior, alternate exterior, consecutive interior, and corresponding angles.
2. Construct formal two-column proofs demonstrating angle congruence.
3. Apply algebraic expressions to solve for unknown angle values.',
'GeoGebra interactive geometry applet, protractors, colored highlighters, proof template handouts.',
'1. Warm-up (10m): Highlighting corresponding angles on street map printouts.
2. Exploration (15m): Dragging transversal in GeoGebra and observing angle measurements dynamically.
3. Proof Modeling (15m): Teacher demonstrates a two-column proof on board for alternate interior angle theorem.
4. Collaborative Practice (15m): Students complete 2 proof templates with partners.
5. Synthesis & Close (5m): Summary of congruent pairs vs supplementary pairs.',
'Exit slip containing one algebraic angle problem and one 4-step proof.',
'Provide scaffolded proof statement banks for struggling students.',
'ready', NOW(), NOW()),

('f0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'Coordinate Geometry: Dilations & Scale Factors', 'Mathematics', '9', 'Unit 3: Similarity & Transformations', '2026-10-19', 60,
'1. Perform dilations centered at the origin on Cartesian coordinate planes.
2. Calculate scale factor k and determine if the transformation is an enlargement or reduction.
3. Connect dilation principles to real architectural scale modeling.',
'Graph paper, rulers, architectural blueprints sample, projector.',
'1. Introduction (10m): Real estate blueprint review - discussing scale ratios.
2. Direct Teaching (15m): Coordinate rule for dilation: (x, y) -> (kx, ky).
3. Hands-on Graphing (20m): Plotting polygon ABC and dilating by factors k = 2 and k = 0.5.
4. Real-world application (10m): Calculating true room dimensions from scaled coordinates.
5. Homework prep (5m): Introduce the Architectural Scale Model performance task.',
'Checked coordinate graphs and homework assignment rubric.',
'Drafting phase: need to finalize blueprint handouts from the local architectural firm.',
'draft', NOW(), NOW());
