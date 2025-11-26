// ========================================================================
// main.js — VietMap Autocomplete (v4) + Search/Geocode (v3) + simple routing
// ========================================================================

// =================== DỮ LIỆU: ROUTES / OPERATORS / STOPS ===================
const ROUTES = [
  {
    id: 'hn-sp',
    name: 'Hà Nội — Sapa',
    A: 'Hà Nội',
    B: 'Sapa',
    operators: [
      {
        id: 'saoviet',
        name: 'Nhà xe Sao Việt',
        stopsAB: [
          { id: 97, name: '114 Trần Nhật Duật', lat: 21.036052898418976, lng: 105.85387432227655 },
          { id: 98, name: '789 Giải Phóng', lat: 20.98606785846243, lng: 105.84129697994503 },
          { id: 99, name: '07 Phạm Văn Đồng', lat: 21.055137831264652, lng: 105.78312515295703 }
        ],
        stopsBA: [
          { id: 101, name: '114 Trần Nhật Duật', lat: 21.036052898418976, lng: 105.85387432227655 },
          { id: 102, name: '789 Giải Phóng', lat: 20.98606785846243, lng: 105.84129697994503 },
          { id: 103, name: '07 Phạm Văn Đồng', lat: 21.055137831264652, lng: 105.78312515295703 }
        ]
      },

      // Nhà xe Hà Hải (nếu đã thêm trước đó)
      {
        id: 'hathai',
        name: 'Nhà xe Hà Hải',
        stopsAB: [
          { id: 201, name: 'Ngõ 105 Khúc Thừa Dụ', lat: 21.030624178435648, lng: 105.79171017994642 },
          { id: 202, name: '57 Nguyễn Quốc Trị', lat: 21.009371449200128, lng: 105.79127021167335 },
          { id: 203, name: '255 Lê Duẩn', lat: 21.016402141155513, lng: 105.84158195295583 },
          { id: 204, name: '247 Giải Phóng', lat: 20.999501206069464, lng: 105.84163289713028 },
          { id: 205, name: 'bến xe yên nghĩa', lat: 20.949909087727182, lng: 105.74766189570403 },
          { id: 206, name: '250 Lê Trọng Tấn - Hà Đông', lat: 20.967841856543597, lng: 105.75604631887785 },
          { id: 207, name: 'CT7 - xuân mai dương nội', lat: 20.962771729295486, lng: 105.74766450043025 },
          { id: 208, name: 'Đại Học Phenikaa', lat: 20.962761411838688, lng: 105.74858981756887 },
          { id: 209, name: 'VĂN KHÊ dương nội', lat: 20.975190609008255, lng: 105.7624776073302 },
          { id: 210, name: 'NGÃ 4 TRUNG VĂN', lat: 20.99064971944928, lng: 105.78319161589683 },
          { id: 211, name: 'TÒA NHÀ BẮC HÀ( đầu lê văn lương -tố hữu)', lat: 20.998084024345996, lng: 105.79537980996635 }
        ],
        stopsBA: [
          { id: 301, name: 'Ngõ 105 Khúc Thừa Dụ', lat: 21.030624178435648, lng: 105.79171017994642 },
          { id: 302, name: '57 Nguyễn Quốc Trị', lat: 21.009371449200128, lng: 105.79127021167335 },
          { id: 303, name: '255 Lê Duẩn', lat: 21.016402141155513, lng: 105.84158195295583 },
          { id: 304, name: '247 Giải Phóng', lat: 20.999501206069464, lng: 105.84163289713028 },
          { id: 305, name: 'bến xe yên nghĩa', lat: 20.949909087727182, lng: 105.74766189570403 },
          { id: 306, name: '250 Lê Trọng Tấn - Hà Đông', lat: 20.967841856543597, lng: 105.75604631887785 },
          { id: 307, name: 'CT7 - xuân mai dương nội', lat: 20.962771729295486, lng: 105.74766450043025 },
          { id: 308, name: 'Đại Học Phenikaa', lat: 20.962761411838688, lng: 105.74858981756887 },
          { id: 309, name: 'VĂN KHÊ dương nội', lat: 20.975190609008255, lng: 105.7624776073302 },
          { id: 310, name: 'NGÃ 4 TRUNG VĂN', lat: 20.99064971944928, lng: 105.78319161589683 },
          { id: 311, name: 'TÒA NHÀ BẮC HÀ( đầu lê văn lương -tố hữu)', lat: 20.998084024345996, lng: 105.79537980996635 }
        ]
      },

      // ========== Nhà Xe Việt Nam (mới thêm) ==========
      {
        id: 'vietnam',
        name: 'Nhà Xe Việt Nam',
        stopsAB: [
          { id: 401, name: 'Ngã 3 Nguyễn Quyền x Lê Duẩn', lat: 21.018245096670096, lng: 105.84142076017402 },
          { id: 402, name: '72 Phố Vọng', lat: 20.997931097996037, lng: 105.84234539817596 },
          { id: 403, name: 'Số 10 ngõ 15 Ngọc Hồi', lat: 20.96029858304492, lng: 105.84260489528424 },
          { id: 404, name: 'Số 4 Thọ Tháp (Cầu Giấy)', lat: 21.031381906684786, lng: 105.79091650878145 },
          { id: 405, name: '43 Nguyễn Quốc Trị', lat: 21.00962379574925, lng: 105.79109121167335 },
          { id: 406, name: 'KĐT Đô Nghĩa', lat: 20.95729090091334, lng: 105.73733976644913 },
          { id: 407, name: 'KĐT Dương Nội 2', lat: 20.963180054802393, lng: 105.74609709343935 },
          { id: 408, name: 'Ngã 4 Văn Phú', lat: 20.96241769787522, lng: 105.76468910604115 },
          { id: 409, name: 'Ngã 4 Vạn Phúc', lat: 20.982713171993996, lng: 105.77034712411988 },
          { id: 410, name: 'Roman Plaza', lat: 20.986045319647822, lng: 105.77772394234862 },
          { id: 411, name: 'Làng Việt Kiều Châu Âu', lat: 20.984409030110395, lng: 105.7858929567034 },
          { id: 412, name: 'BigC Hà Đông', lat: 20.97926108033217, lng: 105.78562445295479 },
          { id: 413, name: 'Cầu Đen', lat: 20.97127158029643, lng: 105.78245431062452 },
          { id: 414, name: 'Bệnh viện K (Tân Triều)', lat: 20.963923502370644, lng: 105.79911675138334 },
          { id: 415, name: 'Cộng Cafe - Linh Đàm', lat: 20.96358769820079, lng: 105.82574599528432 }
        ],
        stopsBA: [
          { id: 501, name: 'Ngã 3 Nguyễn Quyền x Lê Duẩn', lat: 21.018245096670096, lng: 105.84142076017402 },
          { id: 502, name: '72 Phố Vọng', lat: 20.997931097996037, lng: 105.84234539817596 },
          { id: 503, name: 'Số 10 ngõ 15 Ngọc Hồi', lat: 20.96029858304492, lng: 105.84260489528424 },
          { id: 504, name: 'Số 4 Thọ Tháp (Cầu Giấy)', lat: 21.031381906684786, lng: 105.79091650878145 },
          { id: 505, name: '43 Nguyễn Quốc Trị', lat: 21.00962379574925, lng: 105.79109121167335 },
          { id: 506, name: 'KĐT Đô Nghĩa', lat: 20.95729090091334, lng: 105.73733976644913 },
          { id: 507, name: 'KĐT Dương Nội 2', lat: 20.963180054802393, lng: 105.74609709343935 },
          { id: 508, name: 'Ngã 4 Văn Phú', lat: 20.96241769787522, lng: 105.76468910604115 },
          { id: 509, name: 'Ngã 4 Vạn Phúc', lat: 20.982713171993996, lng: 105.77034712411988 },
          { id: 510, name: 'Roman Plaza', lat: 20.986045319647822, lng: 105.77772394234862 },
          { id: 511, name: 'Làng Việt Kiều Châu Âu', lat: 20.984409030110395, lng: 105.7858929567034 },
          { id: 512, name: 'BigC Hà Đông', lat: 20.97926108033217, lng: 105.78562445295479 },
          { id: 513, name: 'Cầu Đen', lat: 20.97127158029643, lng: 105.78245431062452 },
          { id: 514, name: 'Bệnh viện K (Tân Triều)', lat: 20.963923502370644, lng: 105.79911675138334 },
          { id: 515, name: 'Cộng Cafe - Linh Đàm', lat: 20.96358769820079, lng: 105.82574599528432 }
        ]
      },
      // nhà xe DUY KHANG
      {
        id: 'duykhang',
        name: 'Nhà xe Duy Khang',
        stopsAB: [
          { id: 1, name: '8 tôn thất thuyết', lat: 21.02756945396167, lng: 105.78333155414414 },
          { id: 2, name: '59 nguyễn quốc trị', lat: 21.009365739671104, lng: 105.79138635414358 },
          { id: 3, name: '259 Đ. Lê Duẩn, Hoàn Kiếm', lat: 21.015876871718877, lng: 105.84157366767437 },
          { id: 4, name: '93 P. Vọng, Đồng Tâm, Hai Bà Trưng', lat: 20.99880462129507, lng: 105.84222026763727 },
          { id: 5, name: '223 Ng. 42 Thịnh Liệt, Hai Bà Trưng', lat: 20.97111315326469, lng: 105.85064766763657 }
        ],
        stopsBA: [
          { id: 6, name: '8 tôn thất thuyết', lat: 21.02756945396167, lng: 105.78333155414414 },
          { id: 7, name: '59 nguyễn quốc trị', lat: 21.009365739671104, lng: 105.79138635414358 },
          { id: 8, name: '259 Đ. Lê Duẩn, Hoàn Kiếm', lat: 21.015876871718877, lng: 105.84157366767437 },
          { id: 9, name: '93 P. Vọng, Đồng Tâm, Hai Bà Trưng', lat: 20.99880462129507, lng: 105.84222026763727 },
          { id: 10, name: '223 Ng. 42 Thịnh Liệt, Hai Bà Trưng', lat: 20.97111315326469, lng: 105.85064766763657 }
        ]
      },
      // Nhà xe G8
      {
        id: 'g8',
        name: 'Nhà xe G8',
        stopsAB: [
          { id: 11, name: 'AEON MALL Long Biên', lat: 21.02758609637938, lng: 105.8988170541441 },
          { id: 12, name: '160 Trần Quang Khải', lat: 21.03347511640482, lng: 105.85548048113178 },
          { id: 13, name: 'Media Mart 72 Trường Chinh', lat: 20.998647105240877, lng: 105.83992808113095 },
          { id: 14, name: 'Số 4 Khuất Duy Tiến', lat: 20.997863039663084, lng: 105.79716113637139 },
          { id: 15, name: 'Đối diện 120 Trần Quốc Hoàn', lat: 21.042204621852434, lng: 105.78287145414441 },
          { id: 16, name: 'Công Viên Hòa Bình', lat: 21.06418914294022, lng: 105.78760045414488 },
          { id: 17, name: '105 Hoàng Quốc Việt', lat: 21.046137517089356, lng: 105.80118049647368 },
          { id: 18, name: 'Lotte Mall Tây Hồ', lat: 21.07615125290292, lng: 105.8126941634166 },
          { id: 19, name: 'Văn phòng Võ Nguyên Giáp', lat: 21.202318974339963, lng: 105.83306219050661 },
          { id: 20, name: 'Điểm dừng đỗ thôn Bầu', lat: 21.140550088932528, lng: 105.81961145422943 },
          { id: 21, name: 'Sân bay Nội Bài', lat: 21.215344737290454, lng: 105.7919051364464 }
        ],
        stopsBA: [
          { id: 22, name: 'AEON MALL Long Biên', lat: 21.02758609637938, lng: 105.8988170541441 },
          { id: 23, name: '160 Trần Quang Khải', lat: 21.03347511640482, lng: 105.85548048113178 },
          { id: 24, name: 'Media Mart 72 Trường Chinh', lat: 20.998647105240877, lng: 105.83992808113095 },
          { id: 25, name: 'Số 4 Khuất Duy Tiến', lat: 20.997863039663084, lng: 105.79716113637139 },
          { id: 26, name: 'Đối diện 120 Trần Quốc Hoàn', lat: 21.042204621852434, lng: 105.78287145414441 },
          { id: 27, name: 'Công Viên Hòa Bình', lat: 21.06418914294022, lng: 105.78760045414488 },
          { id: 28, name: '105 Hoàng Quốc Việt', lat: 21.046137517089356, lng: 105.80118049647368 },
          { id: 29, name: 'Lotte Mall Tây Hồ', lat: 21.07615125290292, lng: 105.8126941634166 },
          { id: 30, name: 'Văn phòng Võ Nguyên Giáp', lat: 21.202318974339963, lng: 105.83306219050661 },
          { id: 31, name: 'Điểm dừng đỗ thôn Bầu', lat: 21.140550088932528, lng: 105.81961145422943 },
          { id: 32, name: 'Sân bay Nội Bài', lat: 21.215344737290454, lng: 105.7919051364464 }
        ]
      },
      // Nhà xe InterBus
      {
        id: 'interbus',
        name: 'Nhà xe Interbus',
        stopsAB: [
          { id: 40, name: 'BT01, TT3B, Tây Nam Linh Đàm - cafe TOM LEE', lat: 20.96307543622257, lng: 105.82559578297798 },
          { id: 41, name: '419 Giải Phóng (Cafe Nhân)', lat: 20.99521286213309, lng: 105.84147106763714 },
          { id: 42, name: 'ĐH Bách Khoa (Cổng Parabol)', lat: 21.005284282413328, lng: 105.84159451181435 },
          { id: 43, name: '77 Trần Khát Chân', lat: 21.008796046625786, lng: 105.86179128297897 },
          { id: 44, name: 'Số 5 Trần Nguyên Hãn(Cafe Tom + Aha)', lat: 21.028974320553456, lng: 105.85672040730469 },
          { id: 45, name: '58 Đào Tấn (Lenka Cafe)', lat: 21.033171019995265, lng: 105.80759556850312 },
          { id: 46, name: '118 Nguyễn Khánh Toàn (KAFA cafe)', lat: 21.038053213191983, lng: 105.80115062346111 },
          { id: 47, name: '144 Xuân Thủy (Đại Học Quốc Gia Hà Nội)', lat: 21.03706516934016, lng: 105.78268836338317 },
          { id: 48, name: 'Công viên Hòa Bình', lat: 21.064129071423633, lng: 105.78764336948646 }
        ],
        stopsBA: [
          { id: 49, name: 'BT01, TT3B, Tây Nam Linh Đàm - cafe TOM LEE', lat: 20.96307543622257, lng: 105.82559578297798 },
          { id: 50, name: '419 Giải Phóng (Cafe Nhân)', lat: 20.99521286213309, lng: 105.84147106763714 },
          { id: 51, name: 'ĐH Bách Khoa (Cổng Parabol)', lat: 21.005284282413328, lng: 105.84159451181435 },
          { id: 52, name: '77 Trần Khát Chân', lat: 21.008796046625786, lng: 105.86179128297897 },
          { id: 53, name: 'Số 5 Trần Nguyên Hãn(Cafe Tom + Aha)', lat: 21.028974320553456, lng: 105.85672040730469 },
          { id: 54, name: '58 Đào Tấn (Lenka Cafe)', lat: 21.033171019995265, lng: 105.80759556850312 },
          { id: 55, name: '118 Nguyễn Khánh Toàn (KAFA cafe)', lat: 21.038053213191983, lng: 105.80115062346111 },
          { id: 56, name: '144 Xuân Thủy (Đại Học Quốc Gia Hà Nội)', lat: 21.03706516934016, lng: 105.78268836338317 },
          { id: 57, name: 'Công viên Hòa Bình', lat: 21.064129071423633, lng: 105.78764336948646 }
        ]
      },
      {
        id: 'minhanh',
        name: 'Nhà xe Minh Anh',
        stopsAB: [
          { id: 1, name: 'Cầu Vượt Đường Sắt', lat: 21.585713708419828, lng: 105.82451881182755 },
          { id: 2, name: 'Cầu Phù Đổng', lat: 21.041845022287923, lng: 105.93931603880287 },
          { id: 3, name: 'Đường Tròn Vinhome', lat: 21.01169514183512, lng: 105.91946480728073 },
          { id: 4, name: 'Aeon Long Biên', lat: 21.02759683158705, lng: 105.89882130716553 },
          { id: 5, name: 'Time City', lat: 20.99430761437121, lng: 105.86651087670644 },
          { id: 6, name: '230 Nguyễn Khóai', lat: 21.005279345983446, lng: 105.86933632530821 },
          { id: 7, name: '45 Trần Khát Chân', lat: 21.009312386621374, lng: 105.85878745414365 },
          { id: 8, name: 'Viện 108', lat: 21.01838849064766, lng: 105.86040474065003 },
          { id: 9, name: 'Viện Phụ Sản TW', lat: 21.026914340362012, lng: 105.84728301181481 },
          { id: 10, name: 'BV Việt Đức', lat: 21.02839062390216, lng: 105.8474225811318 },
          { id: 11, name: 'BV Viện Mắt', lat: 21.0177256714233, lng: 105.84955001933886 },
          { id: 12, name: 'Công Viên Thống Nhất', lat: 21.014481201219965, lng: 105.84394020996683 },
          { id: 13, name: 'Số 2 Phố Vọng', lat: 21.000093287696085, lng: 105.84155119952199 },
          { id: 14, name: '122 Trường Trinh', lat: 21.002796511605467, lng: 105.82761481224006 },
          { id: 15, name: 'Sân bay Nội Bài', lat: 21.215344737290454, lng: 105.7919051364464 },
          { id: 16, name: 'Võ Chí Công', lat: 21.08154819568925, lng: 105.81475362530988 },
          { id: 17, name: 'Hoàng Quốc Việt', lat: 21.04607738828481, lng: 105.80112683272877 },
          { id: 18, name: 'Công Viên Nghĩa Đô', lat: 21.0406020643444, lng: 105.79694598113198 },
          { id: 19, name: 'Lotte (Đào Tấn)', lat: 21.031947970889775, lng: 105.81221191976145 },
          { id: 20, name: 'Nguyễn Chí Thanh', lat: 21.01854714049255, lng: 105.8079227099728 },
          { id: 21, name: 'Đường láng', lat: 21.012989809201407, lng: 105.80797131272449 },
          { id: 22, name: '17T1 Hoàng Đạo Thúy', lat: 21.010025042002546, lng: 105.80079234806489 },
          { id: 23, name: 'Big C Thăng long', lat: 21.00758944798904, lng: 105.79318799650129 },
          { id: 24, name: 'Big C Hà Đông', lat: 20.979251062709505, lng: 105.7855815388013 },
          { id: 25, name: 'Cầu Nhật Tân', lat: 21.093541379206293, lng: 105.82101679040697 },
          { id: 26, name: 'Ngã Tư Sở', lat: 21.003135882919224, lng: 105.82000536896749 },
          { id: 27, name: 'BV Bạch Mai', lat: 21.002091047417228, lng: 105.84042986735767 }
        ],
        stopsBA: [
          { id: 101, name: 'Cầu Vượt Đường Sắt', lat: 21.585713708419828, lng: 105.82451881182755 },
          { id: 102, name: 'Cầu Phù Đổng', lat: 21.041845022287923, lng: 105.93931603880287 },
          { id: 103, name: 'Đường Tròn Vinhome', lat: 21.01169514183512, lng: 105.91946480728073 },
          { id: 104, name: 'Aeon Long Biên', lat: 21.02759683158705, lng: 105.89882130716553 },
          { id: 105, name: 'Time City', lat: 20.99430761437121, lng: 105.86651087670644 },
          { id: 106, name: '230 Nguyễn Khóai', lat: 21.005279345983446, lng: 105.86933632530821 },
          { id: 107, name: '45 Trần Khát Chân', lat: 21.009312386621374, lng: 105.85878745414365 },
          { id: 108, name: 'Viện 108', lat: 21.01838849064766, lng: 105.86040474065003 },
          { id: 109, name: 'Viện Phụ Sản TW', lat: 21.026914340362012, lng: 105.84728301181481 },
          { id: 110, name: 'BV Việt Đức', lat: 21.02839062390216, lng: 105.8474225811318 },
          { id: 111, name: 'BV Viện Mắt', lat: 21.0177256714233, lng: 105.84955001933886 },
          { id: 112, name: 'Công Viên Thống Nhất', lat: 21.014481201219965, lng: 105.84394020996683 },
          { id: 113, name: 'Số 2 Phố Vọng', lat: 21.000093287696085, lng: 105.84155119952199 },
          { id: 114, name: '122 Trường Trinh', lat: 21.002796511605467, lng: 105.82761481224006 },
          { id: 115, name: 'Sân bay Nội Bài', lat: 21.215344737290454, lng: 105.7919051364464 },
          { id: 116, name: 'Võ Chí Công', lat: 21.08154819568925, lng: 105.81475362530988 },
          { id: 117, name: 'Hoàng Quốc Việt', lat: 21.04607738828481, lng: 105.80112683272877 },
          { id: 118, name: 'Công Viên Nghĩa Đô', lat: 21.0406020643444, lng: 105.79694598113198 },
          { id: 119, name: 'Lotte (Đào Tấn)', lat: 21.031947970889775, lng: 105.81221191976145 },
          { id: 120, name: 'Nguyễn Chí Thanh', lat: 21.01854714049255, lng: 105.8079227099728 },
          { id: 121, name: 'Đường láng', lat: 21.012989809201407, lng: 105.80797131272449 },
          { id: 122, name: '17T1 Hoàng Đạo Thúy', lat: 21.010025042002546, lng: 105.80079234806489 },
          { id: 123, name: 'Big C Thăng long', lat: 21.00758944798904, lng: 105.79318799650129 },
          { id: 124, name: 'Big C Hà Đông', lat: 20.979251062709505, lng: 105.7855815388013 },
          { id: 125, name: 'Cầu Nhật Tân', lat: 21.093541379206293, lng: 105.82101679040697 },
          { id: 126, name: 'Ngã Tư Sở', lat: 21.003135882919224, lng: 105.82000536896749 },
          { id: 127, name: 'BV Bạch Mai', lat: 21.002091047417228, lng: 105.84042986735767 }
        ]
      }
    ]
  }
];


// =================== CẤU HÌNH ===================
// Thay API KEY của bạn vào đây:
const VIETMAP_API_KEY = '0ac4aab085b84c3ed9099ec8d9db9e76e6b65d7b7f7e744e'; // <-- NHỚ THAY
const ORS_API_KEY = ''; // optional: OpenRouteService key nếu có
const MAP_CENTER = [21.0, 106.0];
const SHORTLIST_N = 4;
const CACHE_TTL_MS = 5 * 60 * 1000;

// =================== KHỞI TẠO MAP ===================
const map = L.map('map').setView(MAP_CENTER, 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

let stopsLayer = L.layerGroup().addTo(map);
let userMarker = null;
let routeLine = null;
let routeCache = {};

// UI refs
const logEl = document.getElementById('log');
const resultText = document.getElementById('resultText');
const routeSelect = document.getElementById('routeSelect');
const directionSelect = document.getElementById('directionSelect');
const operatorSelect = document.getElementById('operatorSelect');
const addrInput = document.getElementById('addr');
const btnFind = document.getElementById('btnFind');
const suggestionsList = document.getElementById('suggestionsList');
// btnUseGeol may not exist in DOM; guard when using
const btnUseGeol = document.getElementById('btnUseGeol');

// ========== HELPERS ==========
function l(msg) { if (logEl) logEl.value = `${new Date().toLocaleTimeString()} ${msg}\n` + logEl.value; }
function haversine(a, b) {
  const R = 6371e3, toRad = v => v * Math.PI / 180;
  const φ1 = toRad(a.lat), φ2 = toRad(b.lat);
  const Δφ = toRad(b.lat - a.lat), Δλ = toRad(b.lng - a.lng);
  const sinΔφ = Math.sin(Δφ / 2), sinΔλ = Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(sinΔφ * sinΔφ + Math.cos(φ1) * Math.cos(φ2) * sinΔλ * sinΔλ), Math.sqrt(1 - (sinΔφ * sinΔφ + Math.cos(φ1) * Math.cos(φ2) * sinΔλ * sinΔλ)));
  return R * c;
}
function drawRouteOnMap(coords) {
  if (routeLine) { routeLine.remove(); routeLine = null; }
  routeLine = L.polyline(coords, { color: 'blue', weight: 4 }).addTo(map);
  const bounds = L.latLngBounds(coords);
  if (userMarker) bounds.extend(userMarker.getLatLng());
  map.fitBounds(bounds, { padding: [40, 40] });
}
function placeUserMarker(latlng) {
  if (!latlng || !isFinite(latlng.lat) || !isFinite(latlng.lng)) {
    l('placeUserMarker: tọa độ không hợp lệ: ' + JSON.stringify(latlng));
    return;
  }
  if (userMarker) userMarker.remove();
  userMarker = L.circleMarker([latlng.lat, latlng.lng], { radius: 6, color: '#1e88e5', fillColor: '#1e88e5', fillOpacity: 1, weight: 1 })
    .addTo(map).bindPopup('Bạn');
  map.setView([latlng.lat, latlng.lng], 12);
}
function estimateDurationFromCoords(coords) {
  if (!coords || coords.length < 2) return null;
  let m = 0;
  for (let i = 1; i < coords.length; i++) {
    const a = { lat: coords[i - 1][0], lng: coords[i - 1][1] };
    const b = { lat: coords[i][0], lng: coords[i][1] };
    m += haversine(a, b);
  }
  return m / 11.11; // meters / 11.11 m/s (~40 km/h)
}

// ========== INIT selects ==========
function initRouteOptions() {
  routeSelect.innerHTML = '';
  ROUTES.forEach(r => {
    const o = document.createElement('option'); o.value = r.id; o.text = r.name; routeSelect.appendChild(o);
  });
  onRouteChange();
}
function onRouteChange() {
  const rid = routeSelect.value;
  const r = ROUTES.find(x => x.id === rid);
  directionSelect.innerHTML = '';
  const optAB = document.createElement('option'); optAB.value = 'AB'; optAB.text = `${r.A} → ${r.B}`;
  const optBA = document.createElement('option'); optBA.value = 'BA'; optBA.text = `${r.B} → ${r.A}`;
  directionSelect.appendChild(optAB); directionSelect.appendChild(optBA);
  populateOperators();
}
function populateOperators() {
  operatorSelect.innerHTML = '';
  const r = ROUTES.find(x => x.id === routeSelect.value);
  if (!r) return;
  r.operators.forEach(op => {
    const o = document.createElement('option'); o.value = op.id; o.text = op.name; operatorSelect.appendChild(o);
  });
  loadStopsForSelection();
}
function loadStopsForSelection() {
  stopsLayer.clearLayers();
  const r = ROUTES.find(x => x.id === routeSelect.value);
  if (!r) return;
  const op = r.operators.find(o => o.id === operatorSelect.value) || r.operators[0];
  const dir = directionSelect.value || 'AB';
  const stops = dir === 'AB' ? (op.stopsAB || []) : (op.stopsBA || op.stopsAB.slice().reverse());
  stops.forEach(s => L.marker([s.lat, s.lng]).addTo(stopsLayer).bindPopup(s.name));
  if (stops.length) map.fitBounds(stops.map(s => [s.lat, s.lng]), { padding: [40, 40] });
}

// attach events for selects
routeSelect.addEventListener('change', onRouteChange);
directionSelect.addEventListener('change', loadStopsForSelection);
operatorSelect.addEventListener('change', loadStopsForSelection);

// initial
initRouteOptions();
routeSelect.value = ROUTES[0].id;
directionSelect.value = 'AB';

// ========== VIETMAP AUTOCOMPLETE (v4) & GEOCODE (search v3) ==========

// vietmapAutocomplete: return an array of items (normalized)
async function vietmapAutocomplete(q, limit = 6, focus = null) {
  if (!q || q.trim().length < 1) return [];
  const apikey = encodeURIComponent(VIETMAP_API_KEY);
  let url = `https://maps.vietmap.vn/api/autocomplete/v4?apikey=${apikey}&text=${encodeURIComponent(q)}&display_type=1&limit=${limit}&lang=vi`;
  if (focus) url += `&focus=${encodeURIComponent(focus)}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn('vietmapAutocomplete error', res.status);
    return [];
  }
  const json = await res.json();
  // normalize: API returns array directly in your test — but handle wrapped objects
  let items = json;
  if (!Array.isArray(items)) {
    if (Array.isArray(json.data)) items = json.data;
    else if (Array.isArray(json.items)) items = json.items;
    else if (Array.isArray(json.suggestions)) items = json.suggestions;
    else if (Array.isArray(json.results)) items = json.results;
    else items = [];
  }
  return items;
}

// vietmapGeocode: trả { lat, lng } hoặc null — uses Search v3
// Replace your existing vietmapGeocode with this robust version
async function vietmapGeocode(text, opt = {}) {
  // opt: { tryPlaceRefid: string|null, apikeyOverride: '...' }
  if (!text || !text.trim()) return null;
  const key = encodeURIComponent(opt.apikeyOverride || VIETMAP_API_KEY);
  const q = encodeURIComponent(text);

  // primary: Search v3
  const url = `https://maps.vietmap.vn/api/search/v3?apikey=${key}&text=${q}&limit=1&lang=vi`;
  console.log('[geocode] fetching', url);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn('[geocode] search v3 failed', res.status, await res.text().catch(() => '<no body>'));
      // if 401/403/429 -> surface error
      return null;
    }
    const data = await res.json();
    console.log('[geocode] search v3 response:', data);

    // normalize to first candidate
    let first = null;
    if (Array.isArray(data) && data.length) first = data[0];
    else if (Array.isArray(data.data) && data.data.length) first = data.data[0];
    else if (Array.isArray(data.items) && data.items.length) first = data.items[0];
    else if (Array.isArray(data.features) && data.features.length) first = data.features[0];
    else if (data && typeof data === 'object' && Object.keys(data).length) first = data;

    if (first) {
      // try many shapes
      const x = first.x ?? first.lng ?? first.lon ?? first.geometry?.coordinates?.[0] ?? first._source?.x;
      const y = first.y ?? first.lat ?? first.latitude ?? first.geometry?.coordinates?.[1] ?? first._source?.y;
      const lng = parseFloat(x);
      const lat = parseFloat(y);
      if (isFinite(lat) && isFinite(lng)) {
        console.log('[geocode] found coords from search v3:', { lat, lng });
        return { lat, lng, raw: first };
      }
    }

    // nothing useful
    return null;
  } catch (err) {
    console.error('[geocode] exception', err);
    return null;
  }
}


// Simple cache for geocode (by input text)
const _geocodeCache = {};
async function cachedGeocode(text) {
  const k = (text || '').trim().toLowerCase();
  if (!k) return null;
  if (_geocodeCache[k]) return _geocodeCache[k];
  const r = await vietmapGeocode(text);
  if (r) _geocodeCache[k] = r;
  return r;
}

// ========== showSuggestions (render + click handler) ==========
async function showSuggestions(items) {
  // Normalize items if user passed wrapped response
  if (!Array.isArray(items)) {
    if (Array.isArray(items?.data)) items = items.data;
    else if (Array.isArray(items?.items)) items = items.items;
    else if (Array.isArray(items?.suggestions)) items = items.suggestions;
  }

  suggestionsList.innerHTML = '';
  if (!Array.isArray(items) || items.length === 0) {
    suggestionsList.style.display = 'none';
    return;
  }

  for (const it of items) {
    const li = document.createElement('li');

    // Build safe label
    const label =
      it.display ||
      it.name ||
      it.address ||
      (it.data_new && (it.data_new.display || it.data_new.name)) ||
      'Không rõ địa điểm';
    li.textContent = label;

    // store refid if present
    if (it.ref_id) li.dataset.refid = it.ref_id;

    // try to find coords (entry_points or x/y or lat/lng)
    let lat = null, lng = null;
    const ep =
      (it.entry_points && it.entry_points[0]) ||
      (it.data_new && it.data_new.entry_points && it.data_new.entry_points[0]);
    if (ep) {
      lat = ep.y ?? ep.lat ?? ep[1];
      lng = ep.x ?? ep.lng ?? ep[0];
    } else if (it.y !== undefined && it.x !== undefined) {
      lat = it.y; lng = it.x;
    } else if (it.lat !== undefined && (it.lng !== undefined || it.lon !== undefined)) {
      lat = it.lat; lng = it.lng ?? it.lon;
    }

    // Only accept coords that are explicitly present (not null/undefined/empty) AND numeric
    if (lat != null && lng != null && lat !== '' && lng !== '') {
      const latN = Number(lat);
      const lngN = Number(lng);
      if (isFinite(latN) && isFinite(lngN)) {
        li.dataset.lat = String(latN);
        li.dataset.lng = String(lngN);
      }
    }


    li.addEventListener('click', async () => {
      const displayName = it.name || label;
      addrInput.value = displayName;
      suggestionsList.style.display = 'none';

      // Nếu autocomplete đã có tọa độ thì dùng luôn
      if (li.dataset.lat && li.dataset.lng) {
        addrInput.dataset.lat = li.dataset.lat;
        addrInput.dataset.lng = li.dataset.lng;
        setTimeout(findNearestByName, 150);
        return;
      }

      // Nếu không có entry_points trong autocomplete → gọi Place API trực tiếp
      const refid = li.dataset.refid;
      if (!refid) {
        alert("Không có ref_id để truy vấn Place API.");
        return;
      }

      try {
        const url = `https://maps.vietmap.vn/api/place/v4?apikey=${VIETMAP_API_KEY}&refid=${encodeURIComponent(refid)}`;
        console.log("📌 Calling Place API:", url);

        const res = await fetch(url);
        const p = await res.json();
        console.log("📌 Place API response:", p);

        // Ưu tiên entry_points
        const ep = p.entry_points?.[0];
        if (ep) {
          const lat = ep.y;
          const lng = ep.x;
          addrInput.dataset.lat = lat;
          addrInput.dataset.lng = lng;
          console.log("📌 Coordinates from entry_points:", lat, lng);
          setTimeout(findNearestByName, 150);
          return;
        }

        // fallback lat/lng top-level
        if (p.lat !== undefined && p.lng !== undefined) {
          addrInput.dataset.lat = p.lat;
          addrInput.dataset.lng = p.lng;
          console.log("📌 Coordinates from Place API:", p.lat, p.lng);
          setTimeout(findNearestByName, 150);
          return;
        }

        alert("Place API không trả tọa độ.");
      } catch (err) {
        console.error("Place API error:", err);
        alert("Không thể gọi Place API.");
      }
    });


    suggestionsList.appendChild(li);
  }

  suggestionsList.style.display = 'block';
}

// ========== debounce input handler ==========
function debounce(fn, wait) { let t; return function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); }; }

const handleInput = debounce(async () => {
  const q = addrInput.value.trim();
  // clear any stored coords when user types new text
  delete addrInput.dataset.lat; delete addrInput.dataset.lng; delete addrInput.dataset.lon;
  if (!q || q.length < 1) { showSuggestions([]); return; }
  try {
    l(`Autocomplete (VietMap): "${q}"`);
    // optionally provide focus (map center) to autocomplete
    const center = map.getCenter();
    const focus = `${center.lat.toFixed(8)},${center.lng.toFixed(8)}`;
    const list = await vietmapAutocomplete(q, 6, focus);
    await showSuggestions(list);
  } catch (e) {
    console.warn(e);
    showSuggestions([]);
  }
}, 250);

addrInput.addEventListener('input', handleInput);

// hide suggestions when clicking outside
document.addEventListener('click', (e) => {
  const s = document.getElementById('suggestions');
  if (!s) return;
  if (!s.contains(e.target) && e.target !== addrInput) suggestionsList.style.display = 'none';
});

// keyboard nav (simple)
let focusedIndex = -1;
addrInput.addEventListener('keydown', (ev) => {
  const items = suggestionsList.querySelectorAll('li');
  if (!items.length) return;
  if (ev.key === 'ArrowDown') { ev.preventDefault(); focusedIndex = Math.min(focusedIndex + 1, items.length - 1); items.forEach((it, idx) => it.style.background = idx === focusedIndex ? '#eef6ff' : '#fff'); }
  else if (ev.key === 'ArrowUp') { ev.preventDefault(); focusedIndex = Math.max(focusedIndex - 1, 0); items.forEach((it, idx) => it.style.background = idx === focusedIndex ? '#eef6ff' : '#fff'); }
  else if (ev.key === 'Enter') { if (focusedIndex >= 0 && items[focusedIndex]) { ev.preventDefault(); items[focusedIndex].click(); focusedIndex = -1; } }
});

// =================== GEOLOCATION BUTTON (guarded) ===================
if (btnUseGeol) {
  btnUseGeol.addEventListener('click', () => {
    if (!navigator.geolocation) return alert('Trình duyệt không hỗ trợ Geolocation');
    navigator.geolocation.getCurrentPosition(p => {
      const lat = p.coords.latitude, lng = p.coords.longitude;
      addrInput.value = `${lat},${lng}`;
      addrInput.dataset.lat = lat; addrInput.dataset.lng = lng;
      placeUserMarker({ lat, lng });
    }, err => alert('Không lấy được vị trí: ' + err.message));
  });
}

// ========== ORS route request ==========
function decodePolyline(encoded, precision = 5) {
  let index = 0, lat = 0, lng = 0;
  const coordinates = [];
  const factor = Math.pow(10, precision);

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0; result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    coordinates.push([lat / factor, lng / factor]);
  }

  return coordinates;
}
async function vietmapMatrix(origin, stops) {
  if (!VIETMAP_API_KEY) throw 'NO_VIETMAP_KEY';
  if (!Array.isArray(stops) || stops.length === 0) return { durations: [] };

  // build points: origin first, then stops
  const params = [];
  params.push(`point=${origin.lat},${origin.lng}`);
  stops.forEach(s => params.push(`point=${s.lat},${s.lng}`));
  const destIndices = stops.map((_, i) => i + 1).join(';'); // 1..N
  const url = `https://maps.vietmap.vn/api/matrix?api-version=1.1`
    + `&apikey=${VIETMAP_API_KEY}`
    + `&vehicle=car`
    + `&sources=0`
    + `&destinations=${destIndices}`
    + `&annotation=duration&points_encoded=false&` + params.join('&');

  console.log('Matrix URL:', url);

  const res = await fetch(url);
  if (!res.ok) throw `Matrix lỗi ${res.status}: ${await res.text().catch(() => '')}`;
  const data = await res.json();
  console.log('Matrix response:', data);

  // data.durations should be array of arrays; we asked sources=0 so durations[0] is our row
  const durationsRow = (data.durations && data.durations[0]) || null;
  // normalize: null/undefined entries -> null
  const durations = (durationsRow && Array.isArray(durationsRow)) ? durationsRow.map(v => (v == null ? null : Number(v))) : [];

  return { durations, raw: data };
}

async function vietmapRoute(origin, dest) {
  if (!VIETMAP_API_KEY) throw 'NO_VIETMAP_KEY';

  // endpoint chuẩn của VietMap
  const url = `https://maps.vietmap.vn/api/route?api-version=1.1`
    + `&apikey=${VIETMAP_API_KEY}`
    + `&point=${origin.lat},${origin.lng}`
    + `&point=${dest.lat},${dest.lng}`
    + `&vehicle=car`
    + `&points_encoded=true`;  // trả về polyline5

  console.log("Request route:", url);

  const res = await fetch(url);
  if (!res.ok) throw `VietMap Routing lỗi ${res.status}: ${await res.text()}`;

  const data = await res.json();
  console.log("Response routing:", data);

  const path = data?.paths?.[0];
  if (!path) throw "Không có route trong paths";

  let coords;

  // nếu points_encoded = true → polyline (string)
  if (typeof path.points === "string") {
    coords = decodePolyline(path.points, 5);  // chuỗi encoded polyline5
  }
  // nếu points_encoded = false → array toạ độ
  else if (Array.isArray(path.points)) {
    coords = path.points.map(p => [p[0], p[1]]); // [lat,lng]
  } else {
    throw "Không lấy được geometry từ route";
  }

  return {
    coords,
    distance: path.distance,
    duration: path.time,
    raw: data
  };
}



// ========== MAIN: tìm điểm đón gần nhất ==========
async function findNearestByName() {
  resultText.textContent = 'Đang xử lý...';
  try {
    const raw = addrInput.value.trim();
    if (!raw) throw 'Vui lòng nhập địa điểm (tên hoặc lat,lng)';
    let origin = null;

    // 1) If dataset lat/lng already stored (from suggestion or geocode)
    if ((addrInput.dataset.lat && addrInput.dataset.lng) || addrInput.dataset.lon) {
      const latStr = addrInput.dataset.lat ?? addrInput.dataset.lat;
      const lngStr = addrInput.dataset.lng ?? addrInput.dataset.lon ?? addrInput.dataset.lng;
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (isFinite(lat) && isFinite(lng)) {
        origin = { lat, lng };
        l(`Sử dụng tọa độ được chọn: ${origin.lat},${origin.lng}`);
      } else {
        delete addrInput.dataset.lat; delete addrInput.dataset.lng; delete addrInput.dataset.lon;
        throw 'Tọa độ không hợp lệ từ suggestion';
      }
    } else if (raw.includes(',') && raw.split(',').length === 2 && !isNaN(raw.split(',')[0])) {
      // 2) user typed lat,lng
      const parts = raw.split(',').map(s => s.trim());
      const lat = parseFloat(parts[0]), lng = parseFloat(parts[1]);
      if (!isFinite(lat) || !isFinite(lng)) throw 'Tọa độ bạn nhập không hợp lệ';
      origin = { lat, lng };
      l(`Parsed coordinates from input: ${origin.lat},${origin.lng}`);
    } else {
      // 3) fallback: geocode by text (use cachedGeocode)
      const g = await cachedGeocode(raw);
      if (!g) throw 'Không tìm thấy tọa độ cho địa chỉ';
      origin = { lat: g.lat, lng: g.lng };
      l(`Geocode result (fallback): ${origin.lat},${origin.lng}`);
    }

    placeUserMarker(origin);

    // get stops for current selection
    const route = ROUTES.find(r => r.id === routeSelect.value);
    const op = route.operators.find(o => o.id === operatorSelect.value);
    const dir = directionSelect.value || 'AB';
    const stops = dir === 'AB' ? (op.stopsAB || []) : (op.stopsBA || op.stopsAB.slice().reverse());
    if (!stops || stops.length === 0) throw 'Nhà xe chưa có điểm đón cho hướng này';

    // shortlist by haversine
    const arr = stops.map(s => ({ stop: s, d: haversine(origin, { lat: s.lat, lng: s.lng }) }));
    arr.sort((a, b) => a.d - b.d);
    const shortlist = arr.slice(0, Math.min(SHORTLIST_N, arr.length)).map(x => x.stop);
    l(`Shortlist: ${shortlist.map(s => s.name).join(', ')}`);

    // cache key
    const cacheKey = `${origin.lat.toFixed(4)},${origin.lng.toFixed(4)}|${route.id}|${op.id}|${dir}`;
    const cached = routeCache[cacheKey];
    if (cached && (Date.now() - cached.ts) < CACHE_TTL_MS) {
      drawRouteOnMap(cached.coords);
      resultText.textContent = cached.stop.name;
      l(`Dùng cache cho ${cached.stop.name}`);
      return;
    }

    // evaluate shortlist: if ORS key present, use ORS sequentially; otherwise fallback to straight distance
    // --- START: replace evaluate shortlist and selection logic ---
    // evaluate shortlist: prefer VietMap routing if available, else ORS, else straight-line estimate
    // --- REPLACE: evaluate shortlist: prefer VietMap routing if available, else ORS, else straight-line ---
    // --- START: MATRIX-based selection (replace previous shortlist evaluation) ---
    let best = null;

    try {
      // Call matrix once for shortlist
      const matrixRes = await vietmapMatrix(origin, shortlist);
      // matrixRes.durations is an array aligned with stops order
      const durations = matrixRes.durations; // array of numbers (seconds) or null for unreachable
      l(`Matrix durations: ${durations.map(d => d == null ? 'null' : Math.round(d) + 's').join(', ')}`);

      // find smallest non-null duration
      let idxBest = -1;
      let durBest = Number.POSITIVE_INFINITY;
      for (let i = 0; i < durations.length; i++) {
        const d = durations[i];
        if (d != null && isFinite(d) && d < durBest) {
          durBest = d;
          idxBest = i;
        }
      }

      if (idxBest === -1) {
        // No usable routing results from matrix — fallback to previous method (try VietMap routing per-candidate)
        l('Matrix không trả kết quả hợp lệ cho tất cả candidates — fallback sang per-candidate routing.');
        // fallback: reuse previous per-candidate logic (sequential)
        for (const cand of shortlist) {
          try {
            if (typeof VIETMAP_API_KEY !== 'undefined' && VIETMAP_API_KEY) {
              const r = await vietmapRoute(origin, { lat: cand.lat, lng: cand.lng });
              const duration = r.duration ?? estimateDurationFromCoords(r.coords) ?? Number.MAX_SAFE_INTEGER;
              if (!best || duration < best.duration) best = { stop: cand, coords: r.coords, summary: r.summary || { distance: r.distance, duration: r.duration }, duration };
              continue;
            }
            if (typeof ORS_API_KEY !== 'undefined' && ORS_API_KEY) {
              const r = await requestORSRoute(origin, { lat: cand.lat, lng: cand.lng });
              const duration = r.summary?.duration || estimateDurationFromCoords(r.coords) || Number.MAX_SAFE_INTEGER;
              if (!best || duration < best.duration) best = { stop: cand, coords: r.coords, summary: r.summary, duration };
              continue;
            }
            const d = haversine(origin, { lat: cand.lat, lng: cand.lng });
            const estDur = d / 1000 / 40 * 3600;
            if (!best || estDur < best.duration) best = { stop: cand, coords: [[origin.lat, origin.lng], [cand.lat, cand.lng]], summary: { distance: d, duration: estDur }, duration: estDur };
          } catch (e) {
            l(`Fallback candidate ${cand.name} fail: ${e}`);
          }
        }
      } else {
        // matrix gave a best index
        const chosen = shortlist[idxBest];
        const chosenDuration = durations[idxBest];
        l(`Matrix chọn: ${chosen.name} — ${Math.round(chosenDuration)}s`);

        // Now call routing once to get geometry for chosen stop
        try {
          const routeRes = await vietmapRoute(origin, { lat: chosen.lat, lng: chosen.lng });
          best = { stop: chosen, coords: routeRes.coords, summary: { distance: routeRes.distance, duration: routeRes.duration }, duration: routeRes.duration ?? chosenDuration };
        } catch (e) {
          // if routing fails, still use matrix duration and draw straight fallback polyline
          l(`VietMap routing for chosen stop failed: ${e} — sẽ dùng straight-line fallback`);
          const d = haversine(origin, { lat: chosen.lat, lng: chosen.lng });
          const estDur = d / 1000 / 40 * 3600;
          best = { stop: chosen, coords: [[origin.lat, origin.lng], [chosen.lat, chosen.lng]], summary: { distance: d, duration: estDur }, duration: estDur };
        }
      }
    } catch (matrixErr) {
      l('Matrix call failed: ' + matrixErr + ' — fallback to per-candidate routing.');
      // fallback to per-candidate routing (previous logic)
      for (const cand of shortlist) {
        try {
          if (typeof VIETMAP_API_KEY !== 'undefined' && VIETMAP_API_KEY) {
            const r = await vietmapRoute(origin, { lat: cand.lat, lng: cand.lng });
            const duration = r.duration ?? estimateDurationFromCoords(r.coords) ?? Number.MAX_SAFE_INTEGER;
            if (!best || duration < best.duration) best = { stop: cand, coords: r.coords, summary: r.summary || { distance: r.distance, duration: r.duration }, duration };
            continue;
          }
          if (typeof ORS_API_KEY !== 'undefined' && ORS_API_KEY) {
            const r = await requestORSRoute(origin, { lat: cand.lat, lng: cand.lng });
            const duration = r.summary?.duration || estimateDurationFromCoords(r.coords) || Number.MAX_SAFE_INTEGER;
            if (!best || duration < best.duration) best = { stop: cand, coords: r.coords, summary: r.summary, duration };
            continue;
          }
          const d = haversine(origin, { lat: cand.lat, lng: cand.lng });
          const estDur = d / 1000 / 40 * 3600;
          if (!best || estDur < best.duration) best = { stop: cand, coords: [[origin.lat, origin.lng], [cand.lat, cand.lng]], summary: { distance: d, duration: estDur }, duration: estDur };
        } catch (e) {
          l(`Fallback candidate ${cand.name} fail: ${e}`);
        }
      }
    }

    if (!best) throw 'Không có route hợp lệ (matrix & fallback đều thất bại).';

    // cache and draw (single place)
    routeCache[cacheKey] = { ts: Date.now(), stop: best.stop, coords: best.coords, summary: best.summary };
    drawRouteOnMap(best.coords);
    resultText.textContent = best.stop.name;
    l(`Chọn: ${best.stop.name} — ~${Math.round((best.summary?.duration || best.duration) / 60)} phút`);
    // --- END: MATRIX-based selection ---


    resultText.textContent = best.stop.name;
    l(`Chọn: ${best.stop.name} — ~${Math.round((best.summary?.duration || best.duration) / 60)} phút`);
  } catch (err) {
    resultText.textContent = 'Lỗi: ' + err;
    l('Error: ' + err);
  }
}
if (btnFind) btnFind.addEventListener('click', findNearestByName);

// ========== small UX: close suggestions when pressing ESC ==========
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') suggestionsList.style.display = 'none';
});

// =================== End of file ===================
