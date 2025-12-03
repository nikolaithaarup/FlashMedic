// src/data/ekg/imageLookup.ts

// This file maps imageKey → require(localImage)
// Your backend sends imageKey, and the frontend attaches the real image.

export const ekgImageLookup: Record<string, any> = {
  // RYTMER
  ekg_img_af_rvr: require("../../../assets/ekg/AF with rapid ventricular response.jpg"),
  ekg_img_af_slow_vr: require("../../../assets/ekg/AF with slow ventricular response.jpg"),
  ekg_img_atrial_fib_1: require("../../../assets/ekg/Atrial fibrillation 1.jpg"),
  ekg_img_atrial_fib_2: require("../../../assets/ekg/Atrial fibrillation 2.jpg"),
  ekg_img_atrial_fib_3: require("../../../assets/ekg/Atrial fibrillation 3.jpg"),
  ekg_img_aflutter_2_1: require("../../../assets/ekg/Atrial Flutter 2-1 Blok.jpg"),
  ekg_img_aflutter_4_1: require("../../../assets/ekg/Atrial flutter with 4-1 block.jpg"),
  ekg_img_aflutter_variable: require("../../../assets/ekg/Atrial flutter with variable block.jpg"),

  ekg_img_normal_sinus_1deg_av: require("../../../assets/ekg/Normal sinus rhythm with 1st degree AV block.jpg"),
  ekg_img_sinus_brady_1deg_av: require("../../../assets/ekg/Sinus bradycardia with 1st degree AV block.jpg"),
  ekg_img_sinus_tachy_1: require("../../../assets/ekg/Sinus tachycardia 1.jpg"),
  ekg_img_svt_1: require("../../../assets/ekg/Supraventricular tachycardia 1.jpg"),
  ekg_img_svt_avnrt_1: require("../../../assets/ekg/Supraventricular tachycardia AVNRT 1.jpg"),
  ekg_img_svt_avnrt_2: require("../../../assets/ekg/Supraventricular tachycardia AVNRT 2.jpg"),
  ekg_img_svt_avnrt_adenosin: require("../../../assets/ekg/Supraventricular tachycardia AVNRT med adenosin.jpg"),

  // VT / VF / WPW
  ekg_img_monomorphic_vt_1: require("../../../assets/ekg/Monomorphic VT 1.jpg"),
  ekg_img_monomorphic_vt_2: require("../../../assets/ekg/Monomorphic VT 2.jpg"),
  ekg_img_monomorphic_vt_3: require("../../../assets/ekg/Monomorphic VT 3.jpg"),
  ekg_img_vf_1: require("../../../assets/ekg/VF 1.jpg"),
  ekg_img_vf_2: require("../../../assets/ekg/VF 2.jpg"),
  ekg_img_vf_tdp: require("../../../assets/ekg/VF TdP.jpeg"),
  ekg_img_tdp_hypokalaemia: require("../../../assets/ekg/TdP secondary to hypokalaemia.jpg"),
  ekg_img_wpw: require("../../../assets/ekg/WPW.jpg"),
  ekg_img_wpw_2: require("../../../assets/ekg/WPW 2.jpg"),
  ekg_img_wpw_3: require("../../../assets/ekg/WPW 3.jpg"),

  // BLOKKE / LEDNING
  ekg_img_chb_2: require("../../../assets/ekg/Complete Heart Block 2.jpg"),
  ekg_img_chb_3: require("../../../assets/ekg/Complete Heart Block 3.jpg"),
  ekg_img_chb_4: require("../../../assets/ekg/Complete Heart Block 4.jpg"),
  ekg_img_chb_isorhythmic: require("../../../assets/ekg/Complete Heart Block with Isorhythmic AV Dissociation.jpg"),
  ekg_img_complete_heart_block: require("../../../assets/ekg/Complete heart block.jpg"),
  ekg_img_lbbb_1: require("../../../assets/ekg/LBBB 1.jpg"),
  ekg_img_lbbb_2: require("../../../assets/ekg/LBBB 2.jpg"),
  ekg_img_lbbb_3: require("../../../assets/ekg/LBBB 3.jpg"),
  ekg_img_lbbb_af: require("../../../assets/ekg/LBBB with AF.jpg"),
  ekg_img_rbbb: require("../../../assets/ekg/RBBB.jpg"),
  ekg_img_rbbb_2: require("../../../assets/ekg/RBBB 2.jpg"),
  ekg_img_rbbb_lafb: require("../../../assets/ekg/RBBB with LAFB.jpg"),
  ekg_img_mobitz1_1: require("../../../assets/ekg/Mobitz I AV block 1.jpg"),
  ekg_img_mobitz1_2: require("../../../assets/ekg/Mobitz I AV block 2.jpg"),
  ekg_img_mobitz1_inferior_stemi_rv: require("../../../assets/ekg/Mobitz I AV block associated with inferior STEMI and RV infarction.jpg"),
  ekg_img_mobitz2_hay: require("../../../assets/ekg/Mobitz II Hay block.png"),
  ekg_img_mobitz2: require("../../../assets/ekg/Mobitz type II.jpg"),

  // STEMI
  ekg_img_anterolateral_stemi: require("../../../assets/ekg/Anterolateral STEMI.jpg"),
  ekg_img_high_lateral_stemi_1: require("../../../assets/ekg/High Lateral STEMI 1.jpg"),
  ekg_img_high_lateral_stemi_2: require("../../../assets/ekg/High Lateral STEMI 2.png"),
  ekg_img_hyperacute_anteroseptal_1: require("../../../assets/ekg/Hyperacute Anteroseptal STEMI 1.jpg"),
  ekg_img_hyperacute_anteroseptal_2: require("../../../assets/ekg/Hyperacute Anteroseptal STEMI 2.jpeg"),
  ekg_img_hyperacute_anteroseptal_3: require("../../../assets/ekg/Hyperacute Anteroseptal STEMI 3.jpg"),
  ekg_img_hyperacute_anteroseptal_4: require("../../../assets/ekg/Hyperacute Anteroseptal STEMI 4.jpg"),
  ekg_img_hyperacute_anteroseptal_5: require("../../../assets/ekg/Hyperacute Anteroseptal STEMI 5.jpg"),
  ekg_img_inferior_stemi_1: require("../../../assets/ekg/Inferior STEMI 1.jpg"),
  ekg_img_inferior_stemi_2: require("../../../assets/ekg/Inferior STEMI 2.jpg"),
  ekg_img_inferior_stemi_3: require("../../../assets/ekg/Inferior STEMI 3.jpg"),
  ekg_img_inferior_stemi_4: require("../../../assets/ekg/Inferior STEMI 4.jpg"),
  ekg_img_inferior_stemi_5: require("../../../assets/ekg/Inferior STEMI 5.jpg"),
  ekg_img_inferolateral_stemi_1: require("../../../assets/ekg/Inferolateral STEMI 1.jpg"),
  ekg_img_inferolateral_stemi_2: require("../../../assets/ekg/Inferolateral STEMI 2.jpg"),
  ekg_img_posterior_stemi: require("../../../assets/ekg/Posterior STEMI.jpg"),
  ekg_img_posterior_stemi_2: require("../../../assets/ekg/Posterior STEMI 2.jpg"),

  // ELEKTROLYT/MEDICIN
  ekg_img_digoxin_1: require("../../../assets/ekg/Digoxin effect 1.jpg"),
  ekg_img_digoxin_2: require("../../../assets/ekg/Digoxin effect 2.jpg"),
  ekg_img_digoxin_3: require("../../../assets/ekg/Digoxin effect 3.jpg"),
  ekg_img_hyperk_serum_7: require("../../../assets/ekg/Hyperkalaemia serum K+ 7.0.jpg"),
  ekg_img_hyperk_serum_9_3: require("../../../assets/ekg/Hyperkalemia serum K+ 9.3.jpg"),
  ekg_img_hyperk: require("../../../assets/ekg/Hyperkalemia.jpg"),

  // ANDRE
  ekg_img_osborn_wave: require("../../../assets/ekg/Osborn-Wave hypothermia temp-30°C.jpg"),
  ekg_img_takotsubu: require("../../../assets/ekg/Takotsubu Cardiomyopathy.jpg"),
};
