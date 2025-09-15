-- Add new peptide products to Dark Pino Peptides database
-- Execute this in Supabase SQL editor

INSERT INTO products (name, description, price, category, stock, image_url, is_featured, created_at, updated_at) VALUES

-- HGH 10iu x 10 vials - $220
('HGH 10iu (10 Vials)', 'Human Growth Hormone 10iu per vial, 10 vials per kit. Premium research grade somatropin for advanced scientific studies. Each vial contains 10 international units of highly purified growth hormone.', 220.00, 'peptides', 50, '/images/products/hgh-10iu.jpg', false, NOW(), NOW()),

-- HGH Fragment 176-191 10mg x 10 vials - $637
('HGH Fragment 176-191 10mg (10 Vials)', 'HGH Fragment 176-191 10mg per vial, 10 vials per kit. Specialized fragment of human growth hormone for targeted research applications. Known for its unique properties in metabolic studies.', 637.00, 'peptides', 25, '/images/products/hgh-fragment-176.jpg', false, NOW(), NOW()),

-- Ipamorelin 10mg x 10 vials - $200
('Ipamorelin 10mg (10 Vials)', 'Ipamorelin 10mg per vial, 10 vials per kit. Growth hormone releasing peptide (GHRP) for research into growth hormone secretion and related pathways. High purity research compound.', 200.00, 'peptides', 75, '/images/products/ipamorelin-10mg.jpg', true, NOW(), NOW()),

-- GLOW (BPC-157 + GHK-Cu + TB-500) 70mg x 10 vials - $838
('GLOW Blend (BPC-157 + GHK-Cu + TB-500) 70mg (10 Vials)', 'Premium research blend containing BPC-157 10mg, GHK-Cu 50mg, and TB-500 10mg per vial. Total 70mg active compounds per vial, 10 vials per kit. Advanced multi-peptide formula for comprehensive research.', 838.00, 'blends', 15, '/images/products/glow-blend.jpg', true, NOW(), NOW()),

-- NAD+ 500mg x 20 vials - $238
('NAD+ 500mg (20 Vials)', 'Nicotinamide Adenine Dinucleotide 500mg per vial, 20 vials per kit. Essential coenzyme for cellular energy metabolism research. High purity NAD+ for advanced biochemical studies.', 238.00, 'peptides', 40, '/images/products/nad-plus-500mg.jpg', false, NOW(), NOW()),

-- Melanotan II 10mg x 10 vials - $193
('Melanotan II 10mg (10 Vials)', 'Melanotan II 10mg per vial, 10 vials per kit. Synthetic peptide analog for melanocortin receptor research. High purity compound for scientific investigation of pigmentation pathways.', 193.00, 'peptides', 60, '/images/products/melanotan-ii-10mg.jpg', false, NOW(), NOW()),

-- MOTS-C 10mg x 10 vials - $281
('MOTS-C 10mg (10 Vials)', 'MOTS-C (Mitochondrial ORF of the Twelve S rRNA type-c) 10mg per vial, 10 vials per kit. Mitochondrial-derived peptide for research into cellular metabolism and mitochondrial function.', 281.00, 'peptides', 35, '/images/products/mots-c-10mg.jpg', false, NOW(), NOW()),

-- CJC with DAC 5mg x 10 vials - $790
('CJC-1295 with DAC 5mg (10 Vials)', 'CJC-1295 with Drug Affinity Complex 5mg per vial, 10 vials per kit. Long-acting growth hormone releasing hormone analog for extended research applications. Premium research grade compound.', 790.00, 'peptides', 20, '/images/products/cjc-with-dac-5mg.jpg', true, NOW(), NOW()),

-- 5-Amino-1MQ 10mg x 10 vials - $100
('5-Amino-1MQ 10mg (10 Vials)', '5-Amino-1-methylquinolinium 10mg per vial, 10 vials per kit. NNMT (nicotinamide N-methyltransferase) inhibitor for metabolic research applications. Research-grade compound for cellular studies.', 100.00, 'peptides', 80, '/images/products/5-amino-1mq-10mg.jpg', false, NOW(), NOW()),

-- PEG-MGF 2mg x 10 vials - $340
('PEG-MGF 2mg (10 Vials)', 'PEGylated Mechano Growth Factor 2mg per vial, 10 vials per kit. Modified form of IGF-1 for research into muscle growth and repair mechanisms. Extended half-life formulation for research.', 340.00, 'peptides', 30, '/images/products/peg-mgf-2mg.jpg', false, NOW(), NOW()),

-- PT-141 10mg x 10 vials - $250
('PT-141 10mg (10 Vials)', 'PT-141 (Bremelanotide) 10mg per vial, 10 vials per kit. Melanocortin receptor agonist for research into neurological and behavioral pathways. High purity research compound.', 250.00, 'peptides', 45, '/images/products/pt-141-10mg.jpg', false, NOW(), NOW()),

-- Lemon Bottle 10mg x 10 vials - $210
('Lemon Bottle 10mg (10 Vials)', 'Lemon Bottle lipolytic solution 10mg per vial, 10 vials per kit. Specialized research compound for studies in lipid metabolism and cellular breakdown processes. Research-grade formulation.', 210.00, 'peptides', 55, '/images/products/lemon-bottle-10mg.jpg', false, NOW(), NOW()),

-- AOD 9604 5mg x 10 vials - $363
('AOD 9604 5mg (10 Vials)', 'AOD 9604 (Anti-Obesity Drug) 5mg per vial, 10 vials per kit. Modified fragment of human growth hormone for metabolic research applications. Specialized compound for fat metabolism studies.', 363.00, 'peptides', 25, '/images/products/aod-9604-5mg.jpg', false, NOW(), NOW()),

-- Retatrutide 20mg x 20 vials - $738
('Retatrutide 20mg (20 Vials)', 'Retatrutide 20mg per vial, 20 vials per kit. Triple GIP/GLP-1/glucagon receptor agonist for advanced metabolic research. Next-generation multi-receptor targeting compound for scientific studies.', 738.00, 'peptides', 10, '/images/products/retatrutide-20mg.jpg', true, NOW(), NOW());

-- Verify insertion
SELECT name, price, category, stock FROM products WHERE created_at >= NOW() - INTERVAL '1 minute' ORDER BY created_at DESC;