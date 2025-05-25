import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { HelpCircle, Save, RotateCcw } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkillRadarChartProps {
  careerSkills: string[];
  className?: string;
}

interface SkillData {
  skill: string;
  required: number;
  yours: number;
}

const getRandomRequiredLevel = () => {
  // Generate random required levels between 6-10 to simulate higher professional standards
  return Math.floor(Math.random() * 5) + 6;
};

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ careerSkills, className }) => {
  // Initialize with random required levels and user levels at 1
  const initialSkillData: SkillData[] = careerSkills.map(skill => ({
    skill,
    required: getRandomRequiredLevel(),
    yours: 1
  }));

  const [skillData, setSkillData] = useState<SkillData[]>(initialSkillData);
  const [isEditing, setIsEditing] = useState(false);

  const handleSkillLevelChange = (skillName: string, value: number) => {
    setSkillData(prevData => 
      prevData.map(item => 
        item.skill === skillName ? { ...item, yours: value } : item
      )
    );
  };

  const resetSkills = () => {
    setSkillData(prevData => 
      prevData.map(item => ({ ...item, yours: 1 }))
    );
  };

  // Calculate gap score - how far the user is from meeting all requirements
  const calculateGapScore = (): number => {
    let totalGap = 0;
    let totalRequired = 0;
    
    skillData.forEach(skill => {
      totalGap += Math.max(0, skill.required - skill.yours);
      totalRequired += skill.required;
    });
    
    // Return percentage of requirements met (100% = no gap, 0% = maximum gap)
    return Math.round(100 - (totalGap / totalRequired * 100));
  };

  const gapScore = calculateGapScore();
  
  // Determine match level based on gap score
  const getMatchLevel = (): string => {
    if (gapScore >= 90) return "Kiváló egyezés";
    if (gapScore >= 75) return "Jó egyezés";
    if (gapScore >= 50) return "Közepes egyezés";
    if (gapScore >= 25) return "Alapszintű egyezés";
    return "Kezdő szint";
  };
  
  // Get color based on match level
  const getMatchColor = (): string => {
    if (gapScore >= 90) return "text-green-600";
    if (gapScore >= 75) return "text-green-500";
    if (gapScore >= 50) return "text-yellow-500";
    if (gapScore >= 25) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className={`bg-white p-5 rounded-xl border border-neutral-200 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-neutral-900">Személyes készségfelmérés</h3>
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-4 w-4 text-neutral-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm max-w-xs">
                Értékelje saját készségeit 1-10 skálán minden területen. A radar diagram megmutatja, 
                mennyire felel meg a karrierúthoz szükséges készségszintnek.
              </p>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </div>

      {/* Radar Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
            <PolarGrid strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} />
            <Radar
              name="Elvárt szint"
              dataKey="required"
              stroke="#0284c7"
              fill="#0284c7"
              fillOpacity={0.2}
            />
            <Radar
              name="Az Ön szintje"
              dataKey="yours"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.4}
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 mb-2 flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-500 mb-1">Készség egyezés</div>
          <div className={`font-bold text-lg ${getMatchColor()}`}>
            {getMatchLevel()} ({gapScore}%)
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Bezárás" : "Készségek szerkesztése"}
        </Button>
      </div>

      {/* Skill Level Adjustment Section */}
      {isEditing && (
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-neutral-800">Értékelje készségeit</h4>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-neutral-500"
              onClick={resetSkills}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Alaphelyzet
            </Button>
          </div>
          
          <div className="space-y-5">
            {skillData.map((skill) => (
              <div key={skill.skill} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-700">{skill.skill}</span>
                  <span className="text-sm text-neutral-500">
                    Az Ön szintje: <span className="font-medium text-primary">{skill.yours}</span>
                    <span className="text-neutral-400 mx-1">/</span>
                    <span className="text-neutral-500">Elvárt: {skill.required}</span>
                  </span>
                </div>
                <Slider
                  value={[skill.yours]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => handleSkillLevelChange(skill.skill, value[0])}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-6">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Save className="h-4 w-4 mr-2" />
              Készségek mentése
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillRadarChart;