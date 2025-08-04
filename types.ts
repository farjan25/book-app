export interface Settings {
  pdf_link: string;

  book_title: string;
  author: string;
  project_id: number;

  trim_Size: [number, number];
  bleed: boolean;
  margin: [number, number, number, number];
  margin_check: boolean;

  half_title: number;
  title: number;
  copyright: number;
  dedications: number;
  table_of_contents: [number, number];

  chapter_title_page: number;
  body_font: string,
  heading_size: number,
  left_heading: string;
  right_heading: string;
  heading_height: number;
  heading_side_margin: number;
  body_text_size: number;
  line_spacing: number;
  page_number_location: string;
  extra_text_preceding: string;
  extra_text_after: string;
  numbering_vertical: number;
  numbering_horizontal: number;
  numbering_size: number;
  include_front_matter_in_numbering: boolean;
  front_matter_roman_numerals: boolean;
  front_matter_page_numbers: boolean;
  back_matter_page_numbers: boolean;

  bibliography: number;
  author_background: number;
  index: number;
  extra_pages: string[];

  cover_link: string;
  spine_link: string;
  back_cover_link: string;
  total_cover_link: string;

  fonts: string[]; // Or a more specific type if fonts have structure

  paper_type: string;
  page_count: number;
  cover: boolean;
  spine: boolean;
  back: boolean;
}