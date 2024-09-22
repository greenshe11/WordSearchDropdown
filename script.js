

  class WordSuggestions{
    constructor(wordBag){
      this.wordBag = wordBag
      this.evaluateInput('')
      this.selected = []
      this.words = []
    }
    
    smithWaterman(s1,s2){
        // cloned from: https://github.com/anthonyvittoria/smith-waterman-js/blob/master/smith-waterman.js
        const match = 2;
        const mismatch = -1;
        const gap = -1;
    
        const rows = s1.length + 1;
        const cols = s2.length + 1;
        let distance = 0
        let values = []
        let firstScore = true
        
        function calculate_score(matrix, x, y) {
            /* Calculates score for given coordinate in matrix. */
    
            // compute similarity score
            let similarity = (s1[x-1] == s2[y-1]) ? match : mismatch;
        
            // compute diagonal, above, and left scores
            let score_diag = matrix[x-1][y-1] + similarity;
            let score_above = matrix[x-1][y] + gap;
            let score_left = matrix[x][y-1] + gap;
    
            const array = [score_diag, score_above, score_left]
            const max= Math.max(score_diag, score_above, score_left);
            
            const i = array.indexOf(max)
            values.push(i)
            if (i==0){
            if (similarity==2){
                if (firstScore){
                distance +=0.5
                }
                distance+=1
            }
            if (similarity==-1){
        
                distance-=1
            }
            }
            firstScore = false
            
            return max
            
        }
    
        function create_matrix(rows, cols) {
            /* Create scoring matrix */
    
            // initialize matrix with 0s
            let score_matrix = [];
            for (let i = 0; i < rows; i++) {
                score_matrix[i] = [];
                for (let j = 0; j < cols; j++) {
                    score_matrix[i].push(0);
                }
            }
    
            // compute scores and fill matrix
            let max_score = 0;
            let max_coords = [0,0];
            for (let i = 1; i < rows; i++) {
            
                for (let j = 1; j < cols; j++) {
                
                    let score = calculate_score(score_matrix, i, j);
                    if (score > max_score) {
                        max_score = score;
                        max_coords = [i,j];
                    }
                    score_matrix[i][j] = score;
                }
            }
            
            return [score_matrix, max_coords];
        }
    
        create_matrix(rows,cols)
        let res= rows-distance
        return res
  }
  
  
    editDistance(a, b){
      function customCheck(a, b) {
        return a === b;
    }
      const updateCost = 1 // changing
      const insertCost = 0 // missing
      const deletionCost =1 // removing / excess
  
      var t = [], u, i, j, m = a.length, n = b.length;
      if (!m) { return n; }
      if (!n) { return m; }
      for (j = 0; j <= n; j++) { t[j] = j; }
      for (i = 1; i <= m; i++) {
          for (u = [i], j = 1; j <= n; j++) {
              u[j] = customCheck(a[i - 1], b[j - 1]) ? t[j - 1] : Math.min(t[j - 1] + updateCost, t[j] + deletionCost, u[j - 1] + insertCost); 
          } t = u;
      } return u[n];
  }
  
  
  
      getOverallDistancel(word, wordBasis, func){
        let wordArray = wordBasis.split(' ')
        wordArray.push(wordBasis)
        let leastNum = null
        for (let i=0; i<wordArray.length; i++){
          const key = wordArray[i].toLowerCase()
          
          let distance = func(word, key)
          if (leastNum==null){
            leastNum = distance
          }
          if (distance<leastNum){
            leastNum = distance
          }
        }
        return leastNum
      }
      
      getNearestWord(word, data=null){
        if(!data){
          data = this.wordBag
        }
  
        const func = this.smithWaterman
        const distances = {}
        for (let i=0; i<data.length; i++){
          const key = data[i]
          distances[key] = this.getOverallDistancel(word, key, func)
          
        }
        const sortedEntries = Object.entries(distances).sort(([, valueA], [, valueB]) => valueA - valueB);
        
        const getOutput = (key, value, returnValue)=> {
          if(returnValue){
            return value
          }else{
            return key
          }
          
        }
  
        let res = sortedEntries.slice(0, sortedEntries.length)
        let finalList = []
        let resValues = res.map(([key,value]) => getOutput(key,value,true))
        let resNames = res.map(([key,value]) => getOutput(key,value, false)) // Extract the keys
       
        const topValue = resValues[0]
        let benchmark = topValue*1.5
        if (topValue<0){
          benchmark = topValue/1.5
        }
  
        for (let i=0;i<resValues.length;i++){
          
          if ((resValues[i]<=benchmark || resValues[i]<5)){
            finalList.push(resNames[i])
          }
        }
  
        return finalList
      }
  
    evaluateInput(){
      const word = document.getElementById("textbox").value.toLowerCase();
     
      // get results from input
      const WordsSuggested = this.getNearestWord(word)
      const suggestionList = document.getElementById('words-suggestion-list');
      
      console.log(WordsSuggested)

      suggestionList.innerHTML = ''
      WordsSuggested.forEach(word => {
          const li = document.createElement('li');
          li.textContent = word;
          li.classList.add('dropdown-item')
    
  
          li.onclick = ()=>{this.addToSelectedWords(li)}
          suggestionList.appendChild(li);
      });
    }

    removeWordTag(parent, element){
      parent.removeChild(element)
      this.updateTags(parent)
  
      
    }
    updateTags(element){
      element.childNodes.forEach(word => {
        this.words.push(word.textContent)
      this.words = [...new Set(this.words)];
      });
    }
    addToSelectedWords(element){
      console.log('selected', element.textContent)
      const targetElement = document.getElementById('word-tags-list')
      element.textContent
      let tag = document.createElement('div')
      tag.textContent = element.textContent
      tag.classList.add('word-tag')
      tag.onclick = () => {
        this.removeWordTag(targetElement, tag)
      }
      targetElement.append(tag)
      this.words = []
      this.updateTags(targetElement)

      console.log(this.words)

    }
  }
  
  const leven = new WordSuggestions(
    [
            'Fever and chills', 'Persistent cough', 'Shortness of breath', 'Chest pain',
            'Fatigue and weakness', 'Nausea and vomiting', 'Severe headache', 'Muscle aches',
            'Joint pain', 'Sore throat', 'Runny nose', 'Stomach cramps', 'Diarrhea',
            'Rash and itching', 'Swollen lymph nodes', 'Dizziness and lightheadedness',
            'Insomnia or sleep disturbances', 'Unexplained weight loss', 'Loss of appetite',
            'Skin redness or irritation', 'Heart palpitations', 'Dry mouth', 'Excessive thirst',
            'Numbness or tingling', 'Hot flashes', 'Night sweats', 'Increased sensitivity to light',
            'Difficulty swallowing', 'Ear pain or pressure', 'Feeling faint', 'Abdominal bloating',
            'Constipation or irregular bowel', 'Cold sweats', 'Coughing up blood', 'Pale skin',
            'Feeling anxious or restless', 'Memory loss or confusion', 'Frequent urination',
            'Blood in urine', 'Sensation of spinning', 'Chest tightness', 'Feeling of impending doom',
            'Mood swings', 'Dry skin', 'Change in vision', 'Hearing loss', 'Difficulty concentrating',
            'Swelling in hands or feet', 'Persistent hunger', 'Bruising easily', 'Rapid weight gain',
            'Fainting spells', 'Sensitivity to temperature', 'Severe abdominal pain', 'Jaundice',
            'Wheezing or whistling sound', 'Muscle cramps', 'Lethargy', 'Change in taste',
            'Swollen ankles', 'Painful urination', 'Chronic sinus congestion', 'Feeling overwhelmed',
            'Throat tightness', 'Abnormal sweating', 'Skin lesions', 'Rapid heartbeat',
            'Coughing fits', 'Persistent sneezing', 'Feeling fatigued after sleep', 'Tingling in limbs',
            'Sensation of pressure in the head', 'Unusual bleeding', 'Cold extremities', 'Frequent headaches',
            'Sensitivity to noise', 'Difficulty breathing', 'Nasal congestion', 'Feeling restless',
            'Sudden changes in mood', 'Increased fatigue', 'Fever with rash', 'Nasal discharge',
            'Feeling of fullness in the ear', 'Joint stiffness', 'Tiredness after meals', 
            'Skin peeling', 'Persistent bad breath', 'Abdominal tenderness', 'Changes in hair texture',
            'Frequent infections', 'Sensitivity in the stomach', 'Dry or itchy eyes',
            'Heavy menstrual bleeding', 'Chronic back pain', 'Severe menstrual cramps', 
            'Fever with swollen lymph nodes', 'Abdominal pain after eating', 'Nausea in the morning', 'Dry cough at night', 
            'Sudden weight loss', 'Pain in the lower back', 'Frequent headaches', 
            'Skin rash after exposure', 'Feeling bloated', 'Sensitivity to cold', 
            'Difficulty focusing', 'Severe fatigue after exercise', 'Increased heart rate', 
            'Loss of balance', 'Chronic pain in joints', 'Feeling restless at night', 
            'Recurrent infections', 'Frequent heartburn', 'Painful swallowing', 
            'Muscle stiffness in the morning', 'Cold-like symptoms', 'Pain around the eyes', 
            'Persistent indigestion', 'Itching in the ears', 'Foul-smelling breath', 
            'Throbbing headache', 'Sensation of heaviness in the chest', 
            'Feeling nauseated after meals', 'Muscle twitching', 'Severe dry mouth', 
            'Increased appetite', 'Frequent nosebleeds', 'Pain in the neck', 
            'Hot and cold flashes', 'Changes in bowel habits', 'Itchy skin patches', 
            'Difficulty sleeping', 'Pain when urinating', 'Unusual fatigue', 
            'Pounding headache', 'Bloating after meals', 'Changes in weight', 
            'Feeling faint when standing', 'Chronic sinus pain', 'Severe back pain', 
            'Tingling in fingers', 'Mood changes during the day', 'Frequent yawning', 
            'Severe muscle fatigue', 'Throat discomfort', 'Unexplained bruising', 
            'Pain in the shoulder', 'Sensation of fullness in the stomach', 
            'Persistent sneezing fits', 'Dry or cracked lips', 'Increased sensitivity to pain', 
            'Persistent cough with mucus', 'Numbness in the face', 'Feeling of disorientation', 
            'Change in skin color', 'Sudden vision changes', 'Burning sensation in the stomach', 
            'Soreness in the throat', 'Loss of smell', 'Bumpy skin texture', 
            'Change in body temperature', 'Feeling cold all the time', 'Chronic fatigue', 
            'Feeling dizzy after standing up', 'Decreased ability to taste', 
            'Unusual skin sensitivity', 'Chronic throat clearing', 'Loss of libido', 
            'Increased sensitivity to light', 'Joint swelling', 'Pain radiating down the arm', 
            'Feeling unwell for no reason', 'Severe anxiety attacks', 
            'Feeling of pressure behind the eyes', 'Sudden mood swings', 
            'Rapid breathing', 'Sore muscles after minimal activity', 
            'Change in sleep patterns', 'Frequent cramps', 'Persistent hoarseness', 
            'Skin discoloration', 'Persistent cough with blood', 
            'Feeling jittery or anxious', 'Difficulty in climbing stairs', 
            'Severe cramps during menstruation', 'Unexplained fatigue after sleeping', 
            'Frequent mouth ulcers', 'Pain in the wrists', 'Increased sweating at night'
        
    ]
  )
  window.suggestWords = leven.evaluateInput.bind(leven)
  window.addToSelectedWords = leven.addToSelectedWords.bind(leven)
  window.removeWordTag = leven.removeWordTag.bind(leven)