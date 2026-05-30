-- Swipe & Seoul seed data
-- Run in Supabase SQL Editor

-- REVIEWS (20)

INSERT INTO reviews (nickname, persona, plan_id, rating, body, spots_visited, created_at) VALUES

(
  'Emma from Sydney',
  'Culture Explorer',
  'plan-culture-explorer',
  5,
  'ok so i genuinely did not expect to cry at a palace but gyeongbokgung got me lol. the guard ceremony thing is at 10am and 2pm, totally free, maybe 20 mins. we rented hanbok inside the gates which makes entry free!! wore it for like 3hrs. most ppl miss the pavilion at the very back (hyangwonjeong) it was so peaceful, barely anyone there. def go early tho the tour buses arrive by 10:30 and then its chaos',
  ARRAY['Gyeongbokgung Palace', 'Hyangwonjeong Pavilion'],
  now() - interval '3 days'
),

(
  'Jake from Chicago',
  'Active Hotspot Hunter',
  'plan-active-hunter',
  5,
  'Hongdae on a friday night is INSANE. like ive been to college towns before but nothing hits like this. random busking on every corner, chicken and beer until 5am, the energy is just different man. tip: skip the main strip and go into the side alleys, thats where the real hidden bars are. also Kyochon fried chicken at midnight with soju. thats it. thats the review',
  ARRAY['Hongdae', 'Hapjeong'],
  now() - interval '5 days'
),

(
  'Priya from Singapore',
  'Indoor Trend Seeker',
  'plan-indoor-trend',
  5,
  'seongsu is so shiok lah!! like brooklyn vibes but make it korean. spent the whole saturday just wandering around, every second building got a cafe or pop-up lor. the croissants at Onion Seongsu are no joke, queue starts early. if you go after 10am just be prepared to wait 45min. area around Seoul Forest very walkable also. totally worth the trip from gangnam side',
  ARRAY['Seongsu', 'Seoul Forest'],
  now() - interval '7 days'
),

(
  'Kevin from Hong Kong',
  'Culture Explorer',
  'plan-culture-explorer',
  4,
  'Bukchon very nice but go early morning. I went 9am Sunday had the streets mostly to myself. After 11am becomes very crowded, lots of tour groups. Important: it is residential area, real people live there. Please keep voice down. Best viewpoint is top of the hill, you can see rooftops with N Seoul Tower behind. Classic Seoul photo. Bring good shoes, many stairs.',
  ARRAY['Bukchon Hanok Village'],
  now() - interval '10 days'
),

(
  'Dmitri from Moscow',
  'Culture Explorer',
  'plan-culture-explorer',
  5,
  'I must say that Insadong exceeded my expectations considerably. The traditional tea houses are excellent. We spent nearly four hours exploring the small galleries and craft shops. I purchased several items of folk art which I believe to be quite authentic. One recommendation: there is a large indoor market called Ssamziegil which has many levels and is easy to miss from the street. The bibimbap at the restaurant on the second floor was very satisfying.',
  ARRAY['Insadong', 'Ssamziegil'],
  now() - interval '12 days'
),

(
  'Sophie from Melbourne',
  'Foodie Explorer',
  'plan-foodie',
  5,
  'Gwangjang market changed my life and im not even being dramatic. the bindaetteok (mung bean pancakes) from the lady who has been there for 30 years... heaps of tourists but still feels real somehow?? the raw beef bibimbap is a thing and yes i ate it and yes it was incredible. go hungry. like properly hungry. also the ladies selling will pull you into their stall but its all good fun, just go with it. best food experience ive had in asia easily',
  ARRAY['Gwangjang Market'],
  now() - interval '14 days'
),

(
  'Marcus from Toronto',
  'Active Hotspot Hunter',
  'plan-active-hunter',
  4,
  'N Seoul Tower hike is actually really doable, took us about 45min from Itaewon side. way better than taking the cable car imo because you get the forest walk. the view at top is worth it especially around sunset. one thing they dont tell you: the observation deck costs money but the outdoor area is free and honestly just as good. the lock fence is kinda tacky but also kinda cute. my girlfriend made me do it',
  ARRAY['N Seoul Tower', 'Namsan Park'],
  now() - interval '16 days'
),

(
  'Yuki from Osaka',
  'Indoor Trend Seeker',
  'plan-indoor-trend',
  5,
  'came from japan and honestly seoul style scene is on another level right now. DDP (dongdaemun design plaza) at night is like something from a sci fi movie, zaha hadid architecture looks completely unreal when lit up. also the thrift/vintage shops in dongdaemun are amazing and very cheap compared to japan. spent way too much. the 24hr markets around there are wild also, wholesale fashion at 3am is a whole thing here',
  ARRAY['DDP', 'Dongdaemun'],
  now() - interval '18 days'
),

(
  'Aisha from Dubai',
  'Spa & Wellness',
  'plan-wellness',
  5,
  'Dragon Hill Spa was exactly what i needed after 2 weeks of walking everywhere. 12,000 won for unlimited time, multiple different sauna rooms, rooftop area, pools, the whole thing. i stayed for literally 6 hours. the jimjilbang culture is so interesting, families just sleeping there overnight on the heated floor with those little brick pillow things. felt very safe as a solo female traveler. the skin care area on the women only floor is also amazing',
  ARRAY['Dragon Hill Spa', 'Itaewon'],
  now() - interval '20 days'
),

(
  'Tom from London',
  'Foodie Explorer',
  'plan-foodie',
  4,
  'Noryangjin fish market early morning is quite something. we got there around 6am when the fishermen are bringing stuff in. you pick your fish/shellfish from the stalls downstairs then take it to the restaurants upstairs and they cook it for you. very fresh, very good. its a bit pricey if youre not careful about which stall you pick. the haenyeo women diving footage on the wall is fascinating. def recommend if you dont mind early starts',
  ARRAY['Noryangjin Fish Market'],
  now() - interval '22 days'
),

(
  'Chloe from Paris',
  'Culture Explorer',
  'plan-culture-explorer',
  5,
  'changdeokgung secret garden tour is the most beautiful thing ive seen in korea. you have to book in advance online, limited tickets per day. the autumn colours when we went were extraordinary. our guide spoke excellent english and explained all the history. allow at least half a day for the whole palace plus garden. do NOT skip this for gyeongbokgung, they are very different experiences and this one feels more intimate somehow',
  ARRAY['Changdeokgung Palace', 'Secret Garden'],
  now() - interval '25 days'
),

(
  'Ryan from NYC',
  'Active Hotspot Hunter',
  'plan-active-hunter',
  5,
  'ok lowkey cheonggyecheon stream is one of my fav spots and its not even that famous?? its this restored urban stream right in the middle of downtown, you walk down below street level and suddenly its quiet and pretty. perfect for when you need a break from the city noise. locals come here at lunch to just sit. at night its lit up and romantic. its completely free and the contrast with the buildings above is wild. do it',
  ARRAY['Cheonggyecheon Stream', 'Gwanghwamun'],
  now() - interval '28 days'
),

(
  'Natasha from St Petersburg',
  'Foodie Explorer',
  'plan-foodie',
  4,
  'I wish to mention that Korean BBQ is significantly different when eaten in Korea versus abroad. The quality of the meat at Mapo district restaurants was remarkable. We ordered galbi and samgyeopsal at a restaurant recommended by our hotel staff. The side dishes (banchan) were refilled many times without extra charge which I found very generous. The ventilation systems above each table are quite ingenious. I would say the experience improved considerably by visiting with Korean colleagues who guided us through the ordering.',
  ARRAY['Mapo', 'Korean BBQ'],
  now() - interval '30 days'
),

(
  'Ben from Brisbane',
  'Active Hotspot Hunter',
  'plan-active-hunter',
  5,
  'lotte world tower sky100 observation deck on a clear day, reckon you can see all the way to north korea lol not really but the view is mental. went on a tuesday arvo so no queue at all, paid like 27,000 won which is fair enough. the glass floor bit is heaps scary in a good way. tip: download the T-money app before you come, makes getting around on the metro so much easier. public transport here puts sydney to shame honestly',
  ARRAY['Lotte World Tower', 'Jamsil'],
  now() - interval '33 days'
),

(
  'Isabella from Milan',
  'Indoor Trend Seeker',
  'plan-indoor-trend',
  5,
  'the cafe culture here is absolutely extraordinary. not just the big ones like % Arabica but the tiny independent places in Mangwon and Yeonnam. there is a rooftop cafe in Ikseon-dong (the small hanok alley near Jongno) that I found by accident which had no sign outside, just a wooden door. they do slow drip coffee and the view of the traditional rooftops is stunning. this is not in any guidebook. just wander the alleys in that area',
  ARRAY['Ikseon-dong', 'Jongno'],
  now() - interval '36 days'
),

(
  'Alex from Hong Kong',
  'Foodie Explorer',
  'plan-foodie',
  4,
  'tteokbokki from a pojangmacha (street tent) hits different from a restaurant, just so you know. the ones near Sindang station are famous for it. very spicy but in a good way. also learned that you can order half-half (반반) for rice cakes and fish cake together which is better value. standing outside eating from a paper cup at night with the steam rising is a very authentic korea experience. budget for this whole meal was like 5,000 won',
  ARRAY['Sindang', 'Tteokbokki alley'],
  now() - interval '40 days'
),

(
  'Zoe from Auckland',
  'Spa & Wellness',
  'plan-wellness',
  5,
  'did a full korea skin care routine day and honestly my skin has never looked better. started at the olive young flagship in명동 (myeongdong) loaded up on snail cream and sunscreen. then got a facial at a local skin clinic for like 80,000 won which would cost $400 back home. ended with the jjimjilbang at night. i now fully understand the hype. korea genuinely leads the world on this stuff, everything is cheaper and better quality here than what we import',
  ARRAY['Myeongdong', 'Olive Young', 'Jjimjilbang'],
  now() - interval '42 days'
),

(
  'Lucas from São Paulo',
  'Active Hotspot Hunter',
  'plan-active-hunter',
  4,
  'han river picnic was not what i expected, like i thought it would be a normal park but koreans take this seriously. families with proper portable grills, convenience store chicken and beer, people cycling, couples with matching outfits. rented a bike from Yeouido station area and rode for 2 hours along the river. very relaxing change of pace from all the temple and market visits. the view of the city skyline from the bridge at golden hour was great',
  ARRAY['Han River', 'Yeouido'],
  now() - interval '45 days'
),

(
  'Sarah from Singapore',
  'Culture Explorer',
  'plan-culture-explorer',
  5,
  'ok i have to talk about the palaces because there are FIVE and they are all different ok not just one lah. gyeongbokgung is the biggest and most famous. changdeokgung has the secret garden (book in advance!). deoksugung has a stone wall road that is very romantic. each one has a different history and feeling. dont just do one and think you have seen it all. also the national folk museum inside gyeongbokgung is free and very informative, dont skip it',
  ARRAY['Gyeongbokgung', 'Deoksugung', 'Changdeokgung'],
  now() - interval '48 days'
),

(
  'Mike from Dublin',
  'Foodie Explorer',
  'plan-foodie',
  5,
  'right so i went to Korea expecting to like the food but i did not expect to become completely obsessed. haejang-guk (hangover soup) at 7am after a night out in hongdae, sitting with all the koreans having the same idea, steaming ox bone broth, kimchi, rice... felt like i had died and gone to heaven. the thing about korean food is every meal has like 8 side dishes that just keep coming. even a basic lunch set is an event. going home is going to be rough',
  ARRAY['Hongdae', 'Mapo haejang-guk street'],
  now() - interval '50 days'
);


-- QUESTIONS (8) with explicit UUIDs for answer references

INSERT INTO questions (id, nickname, title, body, tags, created_at) VALUES

(
  '11111111-1111-1111-1111-111111111101',
  'James from London',
  'monthly gym membership near Gangnam L7 hotel?',
  'staying at L7 hotel in gangnam for a month. is there a gym nearby where i can get a 1 month membership? not looking for a day pass, want something i can go to regularly. budget around 50-80k won per month if possible',
  ARRAY['Transport', 'Culture'],
  now() - interval '2 days'
),

(
  '11111111-1111-1111-1111-111111111102',
  'Amy from LA',
  'can you bring outside coffee into restaurants?',
  'this might be a weird question but i got a coffee from a cafe and then we walked into a restaurant for lunch and i wasn''t sure if it''s rude to bring it in? the server looked at me a bit but didn''t say anything. is this normal or was i being impolite',
  ARRAY['Food', 'Culture'],
  now() - interval '4 days'
),

(
  '11111111-1111-1111-1111-111111111103',
  'Marc from Paris',
  'using cafe bathroom without buying anything?',
  'i''ve noticed many cafes in korea seem to not check if you bought something before using the bathroom. is this acceptable or is it considered rude? in france you would definitely need to buy something first',
  ARRAY['Culture'],
  now() - interval '6 days'
),

(
  '11111111-1111-1111-1111-111111111104',
  'Lily from Melbourne',
  'is it true you should pour drinks for others first?',
  'heard that in korea you''re supposed to pour alcohol for the other person at the table and not pour your own drink? and that you should use two hands when receiving? want to make sure i''m not being accidentally rude when i go out drinking with koreans',
  ARRAY['Culture', 'Food'],
  now() - interval '8 days'
),

(
  '11111111-1111-1111-1111-111111111105',
  'David from Singapore',
  'tips for the subway late at night?',
  'how late does the seoul metro run? i heard it stops around midnight but also heard some lines run until 1am on weekends? going out in itaewon this friday and dont want to be stranded. also are taxis easy to find after midnight',
  ARRAY['Transport'],
  now() - interval '10 days'
),

(
  '11111111-1111-1111-1111-111111111106',
  'Nina from Stockholm',
  'is it weird to eat alone at restaurants?',
  'i''m solo traveling and sometimes feel self conscious eating alone especially at korean bbq places where the grill is in the middle. is this common in korea? will staff be awkward about it or do they accommodate solo diners ok',
  ARRAY['Food', 'Culture'],
  now() - interval '13 days'
),

(
  '11111111-1111-1111-1111-111111111107',
  'Carlos from Mexico City',
  'are there any 24hr convenience stores that cook food?',
  'i keep seeing these 편의점 convenience stores (GS25, CU, 7eleven) and someone told me they have hot food and even seating inside sometimes? what should i order and which is the best one? asking for late night hunger emergencies',
  ARRAY['Food'],
  now() - interval '15 days'
),

(
  '11111111-1111-1111-1111-111111111108',
  'Hannah from Berlin',
  'how to get from incheon airport to myeongdong cheapest?',
  'arriving at incheon airport at 11pm. what is the cheapest way to get to myeongdong area? i saw the AREX train but also buses. not sure which is better at night. also do i need to get a T-money card at the airport or can i use my credit card on transit',
  ARRAY['Transport'],
  now() - interval '18 days'
);


-- ANSWERS from Toobie

INSERT INTO answers (question_id, nickname, body, is_local, created_at) VALUES

(
  '11111111-1111-1111-1111-111111111101',
  'Toobie 🇰🇷',
  'oh yes!! there are heaps of gyms near L7. the most convenient ones are probably the 24hr fitness centers called "피트니스월드" or "스포애니" (Sports Any) which are chains all over gangnam. monthly membership is usually around 60,000 to 80,000 won which fits your budget. bring your passport for registration since some places require ID for foreigners. some also do 주3회 (3 times a week) memberships which are cheaper if you don''t need daily access. just google "헬스장 강남역" and you''ll find lots of options near the station',
  true,
  now() - interval '1 day'
),

(
  '11111111-1111-1111-1111-111111111102',
  'Toobie 🇰🇷',
  'haha honestly this is a grey area! technically it''s not great manners to bring outside drinks into a restaurant but most servers won''t say anything directly because koreans tend to avoid confrontation. if it''s a casual place like a korean BBQ or pojangmacha type spot, most people won''t care. if it''s a nicer restaurant i''d finish the coffee outside first just to be safe. the server probably noticed but wasn''t going to make a scene about it, you''re fine!',
  true,
  now() - interval '3 days'
),

(
  '11111111-1111-1111-1111-111111111103',
  'Toobie 🇰🇷',
  'ok real talk, most koreans do this too lol. cafes here are generally fine with it as long as you''re not being obvious about it or taking up a table for long. for smaller independent cafes especially in busy areas like hongdae or insadong, it''s nicer to buy something small if you plan to stay. but if you genuinely just need to use the bathroom quickly and leave, honestly no one is going to stop you or say anything. korea is pretty relaxed about this compared to europe!',
  true,
  now() - interval '5 days'
),

(
  '11111111-1111-1111-1111-111111111104',
  'Toobie 🇰🇷',
  'yes this is real and koreans really do appreciate it when foreigners know this! the rule is: pour for others before yourself, use two hands or one hand with the other touching your elbow/forearm when pouring or receiving. if someone''s glass is empty, offer to refill it. also technically juniors pour for seniors first in formal settings. but honestly for casual drinking with friends just pouring for each other and not yourself is enough to get a "oh you know korean culture!" reaction which is very fun. have a great night out!!',
  true,
  now() - interval '7 days'
),

(
  '11111111-1111-1111-1111-111111111105',
  'Toobie 🇰🇷',
  'last metro is usually around 11:40pm to midnight depending on the line and direction, it varies. friday and saturday some lines extend to about 1am but i wouldn''t rely on this without checking the official schedule. after midnight taxis are plentiful in itaewon and hongdae areas. just use Kakao T app (like uber but for korean taxis) it''s very easy and most drivers accept it. regular taxis are totally safe and not that expensive for short distances. if you''re going far like back to gangnam from itaewon, budget around 10,000-15,000 won by taxi',
  true,
  now() - interval '9 days'
),

(
  '11111111-1111-1111-1111-111111111106',
  'Toobie 🇰🇷',
  'solo travel is very common in korea now and restaurants are pretty accommodating! for regular restaurants totally fine, even many BBQ places now have single grill setups or will just light one side for you. some might offer the tabletop grill for solo but others might suggest the pre-cooked option (like bulgogi stone bowl) which is also delicious. if you really want the full BBQ grill experience solo, go for lunch when it''s less crowded. staff here are mostly kind and will help you figure it out. don''t feel self conscious, many locals eat alone too especially for lunch',
  true,
  now() - interval '12 days'
),

(
  '11111111-1111-1111-1111-111111111107',
  'Toobie 🇰🇷',
  'YES this is one of the best things about korea honestly. GS25 and CU both have seating inside (이마트24 also). for hot food: the ramen cups you cook in the machine with hot water are classic. but the real gems are the 즉석 조리 items, pre-made foods you heat in the microwave, like 삼각김밥 (triangle rice balls), hotdogs, 계란 (boiled eggs), and fried chicken. GS25 is generally considered best quality. CU has a good selection too. late night the convenience stores are full of koreans doing exactly this. totally normal and actually quite good!',
  true,
  now() - interval '14 days'
),

(
  '11111111-1111-1111-1111-111111111108',
  'Toobie 🇰🇷',
  'ok arriving at 11pm! the AREX train is 9,500 won to seoul station and takes 43 minutes, very reliable and runs until about midnight. from seoul station you can take metro line 4 to myeongdong (one stop). this is the cheapest and fastest option. limousine bus is more comfortable but slower and similar price. taxis from incheon are very expensive, like 60,000-80,000 won, i''d avoid unless you have a lot of luggage and it''s split between people. for T-money card: yes get one at the airport from a convenience store or ticket machine! you can also use most foreign credit cards on the metro gates now but T-money is cheaper per ride and works on buses too',
  true,
  now() - interval '17 days'
);
