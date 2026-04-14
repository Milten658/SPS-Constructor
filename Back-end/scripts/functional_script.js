import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://jgyrkytxpdrozrfygpvl.supabase.co",
  "sb_publishable_MgpctTKQmVsqEodIggy_zw_G23nF_Pb",
);

const SearchLineTemplate = document.querySelector("[search-device-temp]");
const SearchLineContainer = document.querySelector("[search-line-container]");
const InputSearch = document.querySelector("[device-search]");

const progressBar = document.querySelector(".progress_bar");
const options = document.querySelectorAll(".posluga_wrapper");
const body = document.body;

const pageSize = 1000;

let devices = [];

// filling up the search options
const fetchDevices = async () => {
  let all = [];
  let from = 0;
  let to = pageSize - 1;

  while (true) {
    const { error, data } = await supabase
      .from("Devices")
      .select("*, Type (*, Department (*)), Brand (*)")
      .range(from, to);

    if (error) {
      console.log("Error of data extraction:" + error.message);
      break;
    }

    all = all.concat(data);

    if (data.length < pageSize) break;

    from += pageSize;
    to += pageSize;
  }

  devices = all.map((device) => {
    const line = SearchLineTemplate.content.cloneNode(true).children[0];

    const image = line.querySelector("[line-device-image]");
    const model = line.querySelector("[line-device-model]");
    const department = line.querySelector("[line-device-department]");
    const price = line.querySelector("[line-device-price]");
    const articule = line.querySelector("[line-device-articule]");

    model.textContent = device.model;
    price.textContent = device.price;
    department.textContent = "Відділ: " + device.Type.Department.department;
    articule.textContent = "Артикул: " + device.id;
    image.src = `https://jgyrkytxpdrozrfygpvl.supabase.co/storage/v1/object/public/device_images/${device.image}`;

    SearchLineContainer.append(line);
    return {
      model: device.model,
      articule: device.id,
      department: device.Type.Department.department,
      element: line,
    };
  });
};

//moving the progress bar on the page
function updateProgress() {
  const progressText = document.querySelector("#progress_text");

  progressBar.classList.remove("stage_1", "stage_2", "stage_3", "stage_4");
  progressBar.classList.add("stage_1");
  progressText.textContent = "1/4 для продовження, оберіть тип послуги";

  let check = false;
  document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    if (cb.checked) {
      check = true;
    }
  });

  if (false) {
    //stage 4?

    return;
  } else if (check) {
    progressBar.classList.remove("stage_1", "stage_2", "stage_3", "stage_4");
    progressBar.classList.add("stage_3");
    progressText.textContent =
      "3/4 для продовження, оберіть бажані параметри послуг";

    return;
  } else if (
    body.classList.contains("remont") ||
    body.classList.contains("obmin")
  ) {
    progressBar.classList.remove("stage_1", "stage_2", "stage_3", "stage_4");
    progressBar.classList.add("stage_2");
    progressText.textContent =
      "2/4 для продовження, оберіть між Гарантійними та Негарантійними випадками";

    return;
  }
}

//
async function fetchAndFillTheList(tableName, bannedList) {
  let query = supabase.from(tableName).select("*");

  if (bannedList.length > 0) {
    const list = `(${bannedList.join(",")})`;
    query = query.not("id", "in", list);
  }

  const { data, error } = await query;
  if (error) {
    console.error(`Error fetching ${tableName}:`, error.message);
    return [];
  }

  return data;
}

// structures Incompatabilities into an object of exception to ignore when fillig out the dropdown
async function comprehendIncompatabilities(incomps) {
  const banned = {
    repair_w_period: [],
    repair_w_number: [],
    repair_unw_period: [],
    repair_unw_number: [],
    replace_w_period: [],
    replace_w_number: [],
    replace_unw_period: [],
    replace_unw_number: [],
    repair_combo: [],
    repair_temp: [],
    replace_combo: [],
    replace_temp: [],
    repair: false,
    replace: false,
    w_repair: false,
    unw_repair: false,
    w_replace: false,
    unw_replace: false,
  };

  incomps.forEach((inc) => {
    const PerNum_are_null =
      inc.service_period == null && inc.service_number == null;
    const bans_are_null =
      PerNum_are_null && inc.combination == null && inc.template == null;

    if (inc.ban_repair) {
      if (inc.ban_warranty && inc.ban_unwarranty && bans_are_null) {
        banned.repair = true;
      }

      if (inc.template !== null) banned.repair_temp.push(inc.template);
      if (inc.combination !== null) banned.repair_combo.push(inc.combination);

      if (inc.ban_warranty) {
        if (PerNum_are_null) {
          banned.w_repair = true;
        } else {
          if (inc.service_period !== null)
            banned.repair_w_period.push(inc.service_period);
          if (inc.service_number !== null)
            banned.repair_w_number.push(inc.service_number);
        }
      }

      if (inc.ban_unwarranty) {
        if (PerNum_are_null) {
          banned.unw_repair = true;
        } else {
          if (inc.service_period !== null)
            banned.repair_unw_period.push(inc.service_period);
          if (inc.service_number !== null)
            banned.repair_unw_number.push(inc.service_number);
        }
      }
    }

    if (inc.ban_replace) {
      if (inc.ban_warranty && inc.ban_unwarranty && bans_are_null) {
        banned.replace = true;
      }

      if (inc.template !== null) banned.replace_temp.push(inc.template);
      if (inc.combination !== null) banned.replace_combo.push(inc.combination);

      if (inc.ban_warranty) {
        if (PerNum_are_null) {
          banned.w_replace = true;
        } else {
          if (inc.service_period !== null)
            banned.replace_w_period.push(inc.service_period);
          if (inc.service_number !== null)
            banned.replace_w_number.push(inc.service_number);
        }
      }

      if (inc.ban_unwarranty) {
        if (PerNum_are_null) {
          banned.unw_replace = true;
        } else {
          if (inc.service_period !== null)
            banned.replace_unw_period.push(inc.service_period);
          if (inc.service_number !== null)
            banned.replace_unw_number.push(inc.service_number);
        }
      }
    }
  });

  console.log(banned);
  return banned;
}

//fetches the incompatabilities table
const fetchIncomps = async (device_id) => {
  console.log("Fetching info for device " + device_id);

  const { error, data } = await supabase
    .from("Devices")
    .select("*, Type (*)")
    .eq("id", device_id)
    .single();

  if (error) {
    console.log("Error of data extraction:" + error.message);
    return;
  }

  const device_type = data.type;
  const device_brand = data.brand;
  const device_price = parseInt(data.price);
  const device_model = data.model;
  const device_department = data.Type.department;

  console.log(data);

  if (data) {
    const { error, data } = await supabase
      .from("Incompatabilities")
      .select("*")
      .or(`type.eq.${device_type},type.is.null`)
      .or(`brand.eq.${device_brand},brand.is.null`)
      .or(`model.eq.${device_model},model.is.null`)
      .or(`department.eq.${device_department},department.is.null`)
      .or(`lower_price_limit.lte.${device_price},lower_price_limit.is.null`)
      .or(`upper_price_limit.gte.${device_price},upper_price_limit.is.null`);

    if (error) {
      console.log("Error of data extraction:" + error.message);
      return;
    }
    console.log(data);
    comprehendIncompatabilities(data);
  }
};

//search algorythm, that hides results that do not match with User's input
InputSearch.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  devices.forEach((device) => {
    const isVisible =
      device.model.toLowerCase().includes(value) ||
      device.articule.toString().toLowerCase() == value.toLowerCase() ||
      device.department.toLowerCase().includes(value);

    device.element.classList.toggle("hide", !isVisible);
  });
});

//
// PAGE START
//

fetchDevices();

const device_form = document.querySelector(".device_info_form");
const side_form = document.querySelector(".side_form");

// picking the device from the searchlist and filling the page with it's info
// initiating the fillment of services dropdown-lists and accounting for incompatabilities
SearchLineContainer.addEventListener("pointerup", (e) => {
  const device = e.target.closest(".search_field_element");
  if (!device) {
    console.log("click not found");
    return;
  }

  device_form.querySelector(".device_name").textContent = device.querySelector(
    "[line-device-model]",
  ).textContent;
  device_form.querySelector("[department]").textContent = device.querySelector(
    "[line-device-department]",
  ).textContent;
  device_form.querySelector("[articule]").textContent = device.querySelector(
    "[line-device-articule]",
  ).textContent;
  device_form.querySelector(".price_calc").textContent = device.querySelector(
    "[line-device-price]",
  ).textContent;
  device_form.querySelector(".device_img").src = device.querySelector(
    "[line-device-image]",
  ).src;

  document.querySelector("#device_value").textContent =
    device.querySelector("[line-device-price]").textContent + "₴";

  updateProgress();
  side_form.classList.add("active");
  document.querySelector(".config_container").classList.add("active");
  document.querySelector(".remont_warning_text").classList.remove("active");

  const text_id = device_form.querySelector("[articule]").textContent;
  fetchIncomps(parseInt(text_id.replace(/\D/g, ""), 10));
});

// opening the service boxes of War/Unwar
options.forEach((option) => {
  option.addEventListener("click", () => {
    const form = option.nextElementSibling;
    const isOpen = option.classList.contains("active");
    let config_wrapper = document.querySelector(".config_container");
    if (!config_wrapper.classList.contains("active")) {
      document.querySelector(".remont_warning_text").classList.add("active");
    }

    options.forEach((o) => {
      o.classList.remove("active");

      const f = o.nextElementSibling;
      if (f) {
        f.style.height = "0px";
      }
    });

    if (
      progressBar.classList.contains("stage_1") ||
      progressBar.classList.contains("stage_2") ||
      progressBar.classList.contains("stage_3") ||
      progressBar.classList.contains("stage_4")
    ) {
      body.classList.remove("remont", "obmin");

      if (!isOpen) {
        option.classList.add("active");

        const name = option.dataset.name;
        if (name) {
          body.classList.add(name);
        }

        form.style.height = "auto";
        const height = form.scrollHeight;

        form.style.height = "0px";

        requestAnimationFrame(() => {
          form.style.height = height + "px";
        });
      } else {
        form.style.height = "0px";
      }

      updateProgress();
    }
  });
});

//Warranty checkboxes interactions
document
  .querySelectorAll('input[type="checkbox"][data-controls]')
  .forEach((cb) => {
    const current_box = cb.closest(".posluga_form");
    current_box.querySelectorAll(cb.dataset.controls).forEach((list) => {
      cb.addEventListener("change", () => {
        list.classList.toggle("active");

        let check = true;
        current_box.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
          if (!cb.checked) {
            check = false;
          }
        });
        updateProgress();
        console.log(check);
        if (check) {
          current_box.querySelector(".other").classList.add("active");
        } else {
          current_box.querySelector(".other").classList.remove("active");
        }
      });
    });
  });

// dropdown lists script
document.querySelectorAll(".dropdown_wrapper").forEach((wrapper) => {
  const main = wrapper.querySelector(".dropdown_main");
  const list = wrapper.querySelector(".dropdown_list");
  const fill = wrapper.querySelector(".dropdown_fill");

  main.addEventListener("click", (e) => {
    e.stopPropagation();

    document.querySelectorAll(".dropdown_wrapper").forEach((w) => {
      const l = w.querySelector(".dropdown_list");
      if (l && l !== list) {
        l.classList.remove("active");
      }
    });

    if (wrapper.classList.contains("active")) {
      list.classList.toggle("active");
    }
  });

  list.addEventListener("click", (e) => {
    if (e.target.classList.contains("dropdown_option")) {
      fill.textContent = e.target.textContent;
      list.classList.remove("active");
    }
  });
});

// dropdown list de-select script
document.addEventListener("click", () => {
  document.querySelectorAll(".dropdown_list").forEach((list) => {
    list.classList.remove("active");
  });
});
